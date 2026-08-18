import subprocess

out = subprocess.run(['git','cat-file','commit','7e6b184'],
                     capture_output=True).stdout
msg = out.split(b'\n\n',1)[1].rstrip(b'\n')
hexb = msg.hex()

lines = []
lines.append("HEX: " + hexb)
lines.append("")

# 候选1: raw 按各编码解码
for enc in ['gbk','gb18030','big5','utf-8']:
    try:
        lines.append(f"[raw->{enc}] " + msg.decode(enc))
    except Exception as e:
        lines.append(f"[raw->{enc}] ERR {e}")

# 候选2: 双重编码反转 raw(utf-8)->mojibake->(gbk)->utf-8
try:
    moji = msg.decode('utf-8')
    lines.append("")
    lines.append("[mojibake utf-8] " + moji)
    for enc in ['gbk','gb18030','big5']:
        try:
            rev = moji.encode(enc, errors='strict').decode('utf-8')
            lines.append(f"[double-rev via {enc}] " + rev)
        except Exception as e:
            lines.append(f"[double-rev via {enc}] ERR {e}")
except Exception as e:
    lines.append("[mojibake utf-8] ERR " + str(e))

with open(r'd:/Project/wxappshopv1/_recovered_msg.txt','w',encoding='utf-8') as f:
    f.write("\n".join(lines))
print("done")
