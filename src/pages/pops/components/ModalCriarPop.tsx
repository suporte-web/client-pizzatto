import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { useState, useRef } from "react";
import { useToast } from "../../../components/Toast";
import { PopsService } from "../../../stores/pops/service";

interface UploadedFile {
  _id: string;
  file: File;
  previewUrl?: string;
}

const ModalCriarPop = ({ setFluskHook }: any) => {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setUploadedFiles([]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map((file) => ({
      _id: Math.random().toString(36).substr(2, 9),
      file,
      previewUrl: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    const fileToRemove = uploadedFiles.find((file) => file._id === id);
    if (fileToRemove?.previewUrl) {
      URL.revokeObjectURL(fileToRemove.previewUrl);
    }
    setUploadedFiles((prev) => prev.filter((file) => file._id !== id));
  };

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleCreate = async () => {
    try {
      console.log("Arquivos para upload:", uploadedFiles);

      if (uploadedFiles.length === 0) {
        showToast("Nenhum arquivo selecionado", "warning");
        return;
      }

      for (const uploadedFile of uploadedFiles) {
        console.log("Enviando arquivo:", uploadedFile.file);

        const formData = new FormData();

        // O campo deve ser 'file' para match com @FileInterceptor('file')
        formData.append("file", uploadedFile.file);

        // Adiciona as informações adicionais como campos textuais
        formData.append("originalName", uploadedFile.file.name);
        formData.append("mimetype", uploadedFile.file.type);
        formData.append("size", uploadedFile.file.size.toString());
        formData.append(
          "filePath",
          `uploads/${Date.now()}_${uploadedFile.file.name}`
        );

        // Debug
        console.log("Conteúdo do FormData:");
        for (const [key, value] of formData.entries()) {
          console.log(
            key,
            value instanceof File ? `File: ${value.name}` : value
          );
        }

        await PopsService.create(formData);
      }

      showToast("POPs criados com sucesso!", "success");
      setFluskHook((prev: any) => !prev);
      handleClose();
    } catch (error) {
      console.error("Erro ao criar POP:", error);
      showToast("Erro ao criar POP", "error");
    }
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{ borderRadius: "10px", textTransform: "none", width: "200px" }}
      >
        Criar POP
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Adicionar POP</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {/* Área de Drag and Drop */}
            <Paper
              variant="outlined"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleAreaClick}
              sx={{
                border: isDragging ? "2px dashed #1976d2" : "2px dashed #ccc",
                backgroundColor: isDragging
                  ? "rgba(25, 118, 210, 0.04)"
                  : "transparent",
                padding: 4,
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.02)",
                  borderColor: "#1976d2",
                },
              }}
            >
              <Typography variant="h6" gutterBottom>
                Arraste arquivos aqui
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                ou clique para selecionar
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Suporte para imagens, PDFs e outros documentos
              </Typography>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInput}
                multiple
                style={{ display: "none" }}
              />
            </Paper>

            {/* Lista de arquivos carregados */}
            {uploadedFiles.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Arquivos selecionados ({uploadedFiles.length})
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {uploadedFiles.map((uploadedFile) => (
                    <Paper
                      key={uploadedFile._id}
                      sx={{
                        position: "relative",
                        width: 100,
                        height: 100,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 1,
                        cursor: "pointer",
                        "&:hover .remove-btn": {
                          opacity: 1,
                        },
                      }}
                    >
                      {uploadedFile.previewUrl ? (
                        <Box
                          component="img"
                          src={uploadedFile.previewUrl}
                          alt={uploadedFile.file.name}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: 1,
                          }}
                        />
                      ) : (
                        <Typography variant="caption" align="center">
                          {uploadedFile.file.name}
                        </Typography>
                      )}

                      <Button
                        className="remove-btn"
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(uploadedFile._id);
                        }}
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          minWidth: "auto",
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          opacity: 0,
                          transition: "opacity 0.3s ease",
                        }}
                      >
                        ×
                      </Button>

                      <Typography variant="caption" sx={{ mt: 0.5 }}>
                        {uploadedFile.file.name.length > 15
                          ? `${uploadedFile.file.name.substring(0, 12)}...`
                          : uploadedFile.file.name}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="error"
            onClick={handleClose}
            sx={{ borderRadius: "10px" }}
          >
            Fechar
          </Button>
          <Button
            variant="contained"
            sx={{ borderRadius: "10px" }}
            onClick={handleCreate}
            disabled={uploadedFiles.length === 0}
          >
            Criar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ModalCriarPop;
