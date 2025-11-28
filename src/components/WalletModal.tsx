import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useWallet } from "../provider";

export default function WalletModal() {
  const { connect, closeModal, isConnecting, isOpen, wallets } = useWallet();

  return (
    <Dialog open={isOpen} onClose={closeModal} fullWidth maxWidth="xs">
      <DialogTitle sx={{ textAlign: "center", fontWeight: 600 }}>
        选择钱包
      </DialogTitle>
      <DialogContent>
        <List>
          {wallets.map((wallet) => (
            <ListItemButton
              key={wallet.id}
              onClick={() => connect(wallet.id)}
              disabled={isConnecting}
              sx={{
                borderRadius: 2,
                mb: 1,
                "&:hover": { backgroundColor: "#f4f4f4" },
              }}
            >
              <ListItemIcon>
                <img
                  src={wallet.icon}
                  alt={wallet.name}
                  width={28}
                  height={28}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography fontWeight={500}>{wallet.name}</Typography>
                }
                secondary={wallet.installed ? "已安装" : "未安装"}
              />
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
