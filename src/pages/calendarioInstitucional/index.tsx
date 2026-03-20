import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
  type ContainerProps,
} from "@mui/material";
import SidebarNew from "../../components/Sidebar";
import {
  Add,
  RefreshOutlined,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { useMemo, useState } from "react";
import { orange, grey } from "@mui/material/colors";

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const CalendarioInstitucional = () => {
  const containerProps: ContainerProps = {
    maxWidth: false,
  };

  const [setores, setSetores] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();

  const monthLabel = useMemo(() => {
    return currentDate.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
  }, [currentDate]);

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startWeekDay = firstDayOfMonth.getDay();
    const totalDays = lastDayOfMonth.getDate();

    const days: Array<{
      day: number | null;
      isToday: boolean;
    }> = [];

    for (let i = 0; i < startWeekDay; i++) {
      days.push({ day: null, isToday: false });
    }

    for (let day = 1; day <= totalDays; day++) {
      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      days.push({ day, isToday });
    }

    return days;
  }, [currentDate, today]);

  const handlePrevMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };

  return (
    <SidebarNew>
      <Container {...containerProps}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            size="small"
            fullWidth
            label="Pesquisar informações"
            InputProps={{ style: { borderRadius: "10px" } }}
          />

          <FormControl fullWidth size="small">
            <InputLabel>Setor</InputLabel>
            <Select
              value={setores}
              label="Setor"
              onChange={(e) => setSetores(e.target.value)}
              sx={{ borderRadius: "10px" }}
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>

          <Tooltip title="Resetar Informações">
            <IconButton sx={{ borderRadius: "10px", bgcolor: orange[200] }}>
              <RefreshOutlined />
            </IconButton>
          </Tooltip>

          <Tooltip title="Criar Evento">
            <IconButton sx={{ bgcolor: orange[200] }}>
              <Add />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider sx={{ m: 2 }} />

        <Box>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 12 }}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  height: "100%",
                }}
              >
                <CardHeader
                  title={
                    <Typography
                      variant="h6"
                      sx={{ textTransform: "capitalize", fontWeight: 700 }}
                    >
                      {monthLabel}
                    </Typography>
                  }
                  action={
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton onClick={handlePrevMonth}>
                        <ChevronLeft />
                      </IconButton>
                      <IconButton onClick={handleNextMonth}>
                        <ChevronRight />
                      </IconButton>
                    </Box>
                  }
                  sx={{ pb: 1 }}
                />

                <CardContent>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, 1fr)",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    {weekDays.map((day) => (
                      <Box
                        key={day}
                        sx={{
                          textAlign: "center",
                          py: 1,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 700,
                            color: "text.secondary",
                          }}
                        >
                          {day}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, 1fr)",
                      gap: 1,
                    }}
                  >
                    {calendarDays.map((item, index) => (
                      <Box
                        key={`${item.day}-${index}`}
                        sx={{
                          aspectRatio: "1 / 1",
                          minHeight: 42,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 2,
                          bgcolor: item.isToday ? orange[300] : grey[100],
                          color: item.isToday ? "#fff" : "text.primary",
                          fontWeight: item.isToday ? 700 : 500,
                          transition: "0.2s",
                          cursor: item.day ? "pointer" : "default",
                          "&:hover": {
                            bgcolor: item.day
                              ? item.isToday
                                ? orange[400]
                                : grey[200]
                              : "transparent",
                          },
                        }}
                      >
                        <Typography variant="body2">
                          {item.day ?? ""}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </SidebarNew>
  );
};

export default CalendarioInstitucional;