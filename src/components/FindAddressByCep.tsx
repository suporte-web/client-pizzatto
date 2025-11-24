import { TextField } from "@mui/material";
import cep from "cep-promise";
import { useEffect } from "react";

const FindAddressByCep = ({ cepAddress, setCepAddress, setInfoCep }: any) => {
  const handleFindByCep = async () => {
    try {
      const get = await cep(cepAddress);
      console.log(get);
      setInfoCep(get);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (cepAddress.length === 8) {
        handleFindByCep();
      }
    }, 500); // 500ms de espera

    return () => clearTimeout(timeout);
  }, [cepAddress]);

  return (
    <>
      <TextField
        label="CEP"
        size="small"
        fullWidth
        value={cepAddress}
        onChange={(e) => {
          const onlyNumbers = e.target.value.replace(/\D/g, "");
          setCepAddress(onlyNumbers);
        }}
        inputProps={{ maxLength: 8 }}
        InputProps={{ style: { borderRadius: "10px" } }}
      />
    </>
  );
};

export default FindAddressByCep;
