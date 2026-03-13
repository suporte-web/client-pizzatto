import { useState } from "react";
import { Box, Collapse, IconButton, Tooltip } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ColaboradorCard from "./ColaboradorCard";

export interface OrganogramaNode {
  dn: string;
  username?: string;
  nome: string;
  email?: string;
  cargo?: string;
  departamento?: string;
  managerDn?: string | null;
  lider?: string | null;
  subordinados: OrganogramaNode[];
  telefone?: string;
}

const CARD_WIDTH = 260;
const HORIZONTAL_GAP = 36;
const LEVEL_GAP = 110;
const CHILD_STEM_HEIGHT = 54;

function NodeItem({ node }: { node: OrganogramaNode }) {
  const children = node.subordinados ?? [];
  const hasChildren = children.length > 0;
  const [expanded, setExpanded] = useState(false);

  return (
    <Box
      sx={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        width: "max-content",
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {hasChildren && (
          <Tooltip title={expanded ? "Recolher equipe" : "Expandir equipe"}>
            <IconButton
              size="small"
              onClick={() => setExpanded((prev) => !prev)}
              sx={{
                position: "absolute",
                top: -14,
                right: -14,
                zIndex: 3,
                width: 40,
                height: 40,
                bgcolor: "#fff",
                border: "1px solid",
                borderColor: "grey.300",
                boxShadow: "0 4px 10px rgba(15,23,42,0.10)",
                "&:hover": {
                  bgcolor: "grey.50",
                },
              }}
            >
              {expanded ? (
                <KeyboardArrowDownIcon fontSize="small" />
              ) : (
                <KeyboardArrowRightIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        )}

        <ColaboradorCard colaborador={node} />
      </Box>

      {hasChildren && (
        <Collapse in={expanded} timeout={250} unmountOnExit>
          <Box
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mt: 2,
              pt: `${LEVEL_GAP}px`,
              width: "max-content",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "2px",
                height: `${LEVEL_GAP - CHILD_STEM_HEIGHT}px`,
                bgcolor: "grey.300",
                borderRadius: 999,
              }}
            />

            {children.length > 1 && (
              <Box
                sx={{
                  position: "absolute",
                  top: `${LEVEL_GAP - CHILD_STEM_HEIGHT}px`,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: `calc(100% - ${CARD_WIDTH}px)`,
                  minWidth: `${(children.length - 1) * (CARD_WIDTH + HORIZONTAL_GAP)}px`,
                  height: "2px",
                  bgcolor: "grey.300",
                  borderRadius: 999,
                }}
              />
            )}

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                gap: `${HORIZONTAL_GAP}px`,
                width: "max-content",
                position: "relative",
              }}
            >
              {children.map((child) => (
                <Box
                  key={child.dn}
                  sx={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: `-${CHILD_STEM_HEIGHT}px`,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "2px",
                      height: `${CHILD_STEM_HEIGHT}px`,
                      bgcolor: "grey.300",
                      borderRadius: 999,
                    }}
                  />

                  <NodeItem node={child} />
                </Box>
              ))}
            </Box>
          </Box>
        </Collapse>
      )}
    </Box>
  );
}

const OrganogramaTree = ({ nodes }: { nodes: OrganogramaNode[] }) => {
  return (
    <Box
      sx={{
        width: "max-content",
        minWidth: "100%",
        px: 12,
        py: 12,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "64px",
          width: "max-content",
        }}
      >
        {nodes.map((node) => (
          <NodeItem key={node.dn} node={node} />
        ))}
      </Box>
    </Box>
  );
};

export default OrganogramaTree;
