import { useState } from "react";
import { Box, IconButton, Popover, Tooltip } from "@mui/material";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";

type Props = {
  onSelect: (emoji: string) => void;
  disabled?: boolean;
};

const emojisRapidos = [
  "😀", "😂", "😍", "👍", "🙏",
  "🎉", "🔥", "❤️", "😎", "🤝",
  "😅", "😢", "😡", "👏", "💡",
];

export default function EmojiPicker({ onSelect, disabled }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (emoji: string) => {
    onSelect(emoji);
  };

  return (
    <>
      <Tooltip title="Adicionar emoji">
        <IconButton
          onClick={handleOpen}
          disabled={disabled}
          sx={{
            width: 55,
            height: 55,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <InsertEmoticonIcon />
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Box
          sx={{
            p: 1,
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 0.5,
            maxWidth: 220,
          }}
        >
          {emojisRapidos.map((emoji) => (
            <IconButton
              key={emoji}
              onClick={() => handleSelect(emoji)}
              sx={{
                fontSize: 18,
                borderRadius: 2,
              }}
            >
              {emoji}
            </IconButton>
          ))}
        </Box>
      </Popover>
    </>
  );
}