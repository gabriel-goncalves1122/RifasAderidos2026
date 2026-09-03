#!/usr/bin/env bash

set -euo pipefail

if [[ "$(uname -s)" != "Linux" ]]; then
  echo "[Inotify] Este ajuste e exclusivo para Linux."
  exit 1
fi

CONFIG_PATH="/etc/sysctl.d/99-sistema-rifas-inotify.conf"

echo "[Inotify] O sudo sera usado somente para gravar ${CONFIG_PATH}."

# Os limites atendem IDE, Vite, TypeScript e Firebase simultaneamente sem
# obrigar todos os watchers a usar polling continuo.
sudo tee "${CONFIG_PATH}" >/dev/null <<'EOF'
fs.inotify.max_user_watches=524288
fs.inotify.max_user_instances=512
fs.inotify.max_queued_events=32768
EOF

sudo sysctl --system >/dev/null

echo "[Inotify] Limites aplicados:"
sysctl fs.inotify.max_user_watches
sysctl fs.inotify.max_user_instances
sysctl fs.inotify.max_queued_events
