# lifegame WireGuard 私有访问

目标：手机通过 WireGuard 直连阿里云 ECS，再访问 lifegame。

公网只开放：

- SSH: TCP 22
- WireGuard: UDP 51820

不要开放：

- TCP 4173

手机连接 WireGuard 后访问：

```text
http://10.8.0.1:4173
```
