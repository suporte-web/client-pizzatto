import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
  type ContainerProps,
} from "@mui/material";
import SidebarNew from "../../components/Sidebar";
import {
  RefreshOutlined,
  ChevronLeft,
  ChevronRight,
  Event,
} from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { orange, grey } from "@mui/material/colors";
import ModalCreateCalendario from "./components/ModalCreateCalendario";
import { CalendarioService } from "../../stores/calendario/service";
import { UserAdService } from "../../stores/adLdap/serviceUsersAd";
import ModalSeeEventos from "./components/ModalSeeEventos";
import { useUser } from "../../UserContext";

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

type CalendarioItem = {
  id: string;
  nome: string;
  data: string;
  horario?: string;
  local?: string;
  criadoPor?: string;
  createdAt?: string;
  updatedAt?: string;
  area?: string;
  descricao?: string;
};

type CalendarDay = {
  day: number | null;
  isToday: boolean;
  dateKey: string | null;
};

const CalendarioInstitucional = () => {
  const containerProps: ContainerProps = {
    maxWidth: false,
  };
  const { user } = useUser();

  const [colaboradores, setColaboradores] = useState<string[]>([]);
  // const [departamento, setDepartamento] = useState("");
  const [pesquisa, setPesquisa] = useState("");

  const [calendarios, setCalendarios] = useState<CalendarioItem[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedEvents, setSelectedEvents] = useState<CalendarioItem[]>([]);

  const [flushHook, setFlushHook] = useState(false);

  const hasRole = (roles: string[]) =>
    roles.some((role) => user?.roles?.includes(role));

  const today = new Date();

  const monthLabel = useMemo(() => {
    return currentDate.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
  }, [currentDate]);

  const eventosPorDia = useMemo(() => {
    const mapa: Record<string, CalendarioItem[]> = {};

    for (const evento of calendarios) {
      if (!evento?.data) continue;

      const chave = evento.data;

      if (!mapa[chave]) {
        mapa[chave] = [];
      }

      mapa[chave].push(evento);
    }

    return mapa;
  }, [calendarios]);

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startWeekDay = firstDayOfMonth.getDay();
    const totalDays = lastDayOfMonth.getDate();

    const days: CalendarDay[] = [];

    for (let i = 0; i < startWeekDay; i++) {
      days.push({ day: null, isToday: false, dateKey: null });
    }

    for (let day = 1; day <= totalDays; day++) {
      const isToday =
        day === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      days.push({ day, isToday, dateKey });
    }

    return days;
  }, [currentDate, today]);

  const handlePrevMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  const handleResetFilters = () => {
    setPesquisa("");
    // setDepartamento("");
    setFlushHook((prev: any) => !prev);
    setCurrentDate(new Date());
  };

  const handleOpenDayEvents = (dateKey: string, eventos: CalendarioItem[]) => {
    setSelectedDate(dateKey);
    setSelectedEvents(eventos);
    setDialogOpen(true);
  };

  const fetchData = async () => {
    try {
      const find = await CalendarioService.findByFilter({
        data: currentDate,
        colaborador: user?.name,
        pesquisa,
      });

      setCalendarios(find.result ?? []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [flushHook, pesquisa, currentDate, user]);

  const fetchArea = async () => {
    try {
      const get = await UserAdService.getAllActiveUsers();
      setColaboradores(get ?? []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchArea();
  }, []);

  return (
    <SidebarNew>
      <Container {...containerProps}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            size="small"
            fullWidth
            value={pesquisa}
            onChange={(e) => {
              setPesquisa(e.target.value);
            }}
            label="Pesquisar informações"
            InputProps={{ style: { borderRadius: "10px" } }}
          />

          {hasRole(["ADMIN", "ENDOMARKETING", "PESSOAS_E_CULTURA"]) && (
            <>
              {/* <FormControl fullWidth size="small">
                <InputLabel>Departamento</InputLabel>
                <Select
                  value={departamento}
                  label="Departamento"
                  onChange={(e) => setDepartamento(e.target.value)}
                  sx={{ borderRadius: "10px" }}
                >
                  {departamentos.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> */}

              <IconButton
                sx={{ borderRadius: "10px", bgcolor: orange[200] }}
                onClick={handleResetFilters}
              >
                <RefreshOutlined />
              </IconButton>

              <ModalCreateCalendario
                setFlushHook={setFlushHook}
                colaboradores={colaboradores}
              />
            </>
          )}
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
                      gap: 0.5,
                      mb: 1,
                    }}
                  >
                    {weekDays.map((day) => (
                      <Box
                        key={day}
                        sx={{
                          textAlign: "center",
                          py: 0.5,
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
                      gap: 0.5,
                    }}
                  >
                    {calendarDays.map((item, index) => {
                      const eventosDoDia = item.dateKey
                        ? (eventosPorDia[item.dateKey] ?? [])
                        : [];

                      const temEvento = eventosDoDia.length > 0;

                      const content = (
                        <Box
                          sx={{
                            height: 50,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderRadius: "10px",
                            bgcolor: item.isToday ? orange[300] : grey[100],
                            color: item.isToday ? "#fff" : "text.primary",
                            fontWeight: item.isToday ? 700 : 500,
                            transition: "0.2s",
                            cursor:
                              item.day && temEvento ? "pointer" : "default",
                            p: 0.5,
                            "&:hover": {
                              bgcolor:
                                item.day && temEvento
                                  ? item.isToday
                                    ? orange[400]
                                    : grey[200]
                                  : item.isToday
                                    ? orange[300]
                                    : grey[100],
                            },
                          }}
                          onClick={() => {
                            if (item.dateKey && temEvento) {
                              handleOpenDayEvents(item.dateKey, eventosDoDia);
                            }
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, fontSize: "0.8rem" }}
                          >
                            {item.day ?? ""}
                          </Typography>

                          {temEvento && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.3,
                              }}
                            >
                              <Event sx={{ fontSize: 12 }} />
                              <Typography
                                variant="caption"
                                sx={{ fontSize: "0.6rem", fontWeight: 700 }}
                              >
                                {eventosDoDia.length}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      );

                      if (!item.day) {
                        return (
                          <Box key={`empty-${index}`} sx={{ height: 50 }}>
                            {content}
                          </Box>
                        );
                      }

                      return <Box key={item.dateKey}>{content}</Box>;
                    })}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <ModalSeeEventos
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedEvents={selectedEvents}
          setSelectedEvents={setSelectedEvents}
        />
      </Container>
    </SidebarNew>
  );
};

export default CalendarioInstitucional;
