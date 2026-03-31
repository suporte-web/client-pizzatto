import { Box, Container, Paper, TextField } from "@mui/material";
import SidebarNew from "../../components/Sidebar";
import { useState } from "react";

const Holerites = () => {
  const [pesquisa, setPesquisa] = useState("");

  return (
    <SidebarNew>
      <Container>
        <Paper elevation={1} sx={{ borderRadius: "10px", p: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <TextField
              size="small"
              label="Pesquisar"
              fullWidth
              value={pesquisa}
              onChange={(e) => {
                setPesquisa(e.target.value);
              }}
              InputProps={{ style: { borderRadius: "10px" } }}
            />
            {/* <ModalCreatePolitica
              setFlushHook={setFlushHook}
              departamentos={departamentos}
            /> */}
          </Box>
        </Paper>
      </Container>
    </SidebarNew>
  );
};

export default Holerites;
