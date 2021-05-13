import React, { useState } from "react";
import {
  TextField,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TableContainer,
  TableCell,
  TableHead,
  TableBody,
  Table,
  Paper,
  TableRow,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { API_URL } from "../config";
import useSWR from "swr";
import { db } from "../firebase";
import Router from "next/router";
const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "100vh",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  button: {
    margin: 20,
  },
  textfield: {
    margin: 20,
  },
}));

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Home() {
  const classes = useStyles();
  const [errorYear, seterrorYear] = useState(false);
  const [errorNim, seterrorNim] = useState(false);
  const [errorKdprodi, seterrorKdProdi] = useState(false);

  const [form, setform] = useState({
    nim: "",
    nama: "",
    jnskelamin: "",
    kdprodi: "",
    tahunmsk: "",
  });

  const { data, error } = useSWR("/api/mahasiswa", fetcher);
  const handleYear = (event) => {
    seterrorYear(false);
    let date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
    if (
      date_regex.test(event.target.value) ||
      event.target.value.length === 4
    ) {
      setform({ ...form, tahunmsk: event.target.value });
    } else if (event.target.value.length === 0) {
      seterrorYear(false);
    } else {
      seterrorYear(true);
    }
  };

  const handleNim = (event) => {
    seterrorNim(false);
    let nim_regex = /^[a-z]{0,10}$/;
    if (
      nim_regex.test(event.target.value) ||
      event.target.value.length === 10
    ) {
      setform({ ...form, nim: event.target.value });
    } else if (event.target.value.length === 0) {
      seterrorNim(false);
    } else {
      seterrorNim(true);
    }
  };
  const handleKdProdi = (event) => {
    seterrorKdProdi(false);
    if (event.target.value.length === 3 || event.target.value.length === 2) {
      setform({ ...form, kdprodi: event.target.value });
    } else {
      seterrorKdProdi(true);
    }
  };
  const inputData = () => {
    try {
      db.collection("mahasiswa").doc().set(
        {
          nim: form.nim,
          nama: form.nama,
          jnskel: form.jnskelamin,
          kdprodi: form.kdprodi,
          tahunmsk: form.tahunmsk,
        },
        { merge: true }
      );
      alert("Input Data Berhasil");
    } catch (error) {
      alert("Gagal Input Data");
    }
  };
  return (
    <Container>
      <h1>Form Mahasiswa</h1>
      <TextField
        fullWidth
        style={{ margin: 20 }}
        onChange={(event) => handleNim(event)}
        label='NIM'
        size='small'
        type='text'
      />
      {errorNim && (
        <p style={{ color: 12, color: "red", margin: 20 }}>
          Input NIM Belum Valid
        </p>
      )}
      <TextField
        fullWidth
        style={{ margin: 20 }}
        onChange={(event) => setform({ ...form, nama: event.target.value })}
        label='Nama'
        size='small'
        type='text'
      />
      <FormControl fullWidth style={{ margin: 20 }}>
        <InputLabel id='demo-customized-select-label'>Jenis Kelamin</InputLabel>
        <Select
          value={form.jnskelamin}
          onChange={(event) =>
            setform({ ...form, jnskelamin: event.target.value })
          }
          labelId='demo-customized-select-label'
          id='demo-customized-select'
        >
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          <MenuItem value={"Pria"}>Pria</MenuItem>
          <MenuItem value={"Wanita"}>Wanita</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        style={{ margin: 20 }}
        label='Kode Prodi'
        size='small'
        placeholder='ex: SIF,TI'
        type='text'
        onChange={(event) => handleKdProdi(event)}
      />
      {errorKdprodi && (
        <p style={{ color: 12, color: "red", margin: 20 }}>
          Input Kode Prodi Belum Valid
        </p>
      )}

      <TextField
        placeholder='ex: 2018,2019'
        fullWidth
        label='Tahun Masuk'
        type='text'
        style={{ margin: 20 }}
        onChange={(event) => handleYear(event)}
        size='small'
      />
      {errorYear && (
        <p style={{ color: 12, color: "red", margin: 20 }}>
          Input Tahun Belum Valid
        </p>
      )}
      <Button
        disabled={
          errorNim ||
          errorYear ||
          form.jnskelamin === "" ||
          form.nim === "" ||
          form.nama === "" ||
          form.tahunmsk === "" ||
          form.kdprodi === ""
        }
        style={{ margin: 20 }}
        className={classes.button}
        color='secondary'
        type='submit'
        variant='contained'
        onClick={(event) => inputData(event)}
      >
        Sumbit
      </Button>

      <TableContainer component={Paper}>
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Nim</TableCell>
              <TableCell>Nama</TableCell>
              <TableCell>Jenis Kelamin</TableCell>
              <TableCell>Kode Prodi</TableCell>
              <TableCell>Tahun Masuk</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <p>{index + 1}</p>
                </TableCell>
                <TableCell>{item.nim}</TableCell>
                <TableCell>{item.nama}</TableCell>
                <TableCell>{item.jnskel}</TableCell>
                <TableCell>{item.kdprodi}</TableCell>
                <TableCell>{item.tahunmsk}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
