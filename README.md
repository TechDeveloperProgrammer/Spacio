# Spacio

sudo mkdir -p /etc/keyd && \
printf "[ids]\n*\n\n[main]\nrightshift = space\n" | sudo tee /etc/keyd/default.conf > /dev/null && \
sudo systemctl enable keyd && \
sudo systemctl restart keyd
