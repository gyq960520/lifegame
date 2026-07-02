# lifegame 私有部署

目标：lifegame 只给自己的 Tailscale 设备访问，不公开到公网。

## 服务器启动

```bash
cd /opt/lifegame
docker compose up -d --build
```

服务只绑定本机：

```text
127.0.0.1:4173
```

## Tailscale 私有访问

安装并登录 Tailscale 后：

```bash
sudo tailscale serve --bg http://127.0.0.1:4173
tailscale serve status
```

手机和电脑打开 Tailscale 后，访问 Tailscale 给出的 HTTPS 地址。

## 更新代码

```bash
cd /opt/lifegame
git pull
docker compose up -d --build
```
