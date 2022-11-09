import { Autocomplete, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React, { useEffect, useState } from "react";

export default function FireBarista({ openSnackbar }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([{name: "test"}]);
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const loading = open && options.length === 0;

  useEffect(() => {
    getBaristas();
  }, [])

  function getBaristas() {
    fetch('api/employees/')
      .then(response => response.json())
      .then(json => {
        setOptions(json);
      })
  }

  function save() {
    if (!value) {
      openSnackbar("No user selected", true);
      return;
    }

    let formData = new FormData();
    formData.append(
      'csrfmiddlewaretoken',
      getCookie('csrftoken')
    )
    formData.append(
      'id',
      value.id
    )

    fetch('api/fire/', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(json => {
        if (json.error) {
          openSnackbar(json.error, true);
        }
        else {
          openSnackbar('Successfully added barista');
          setValue(null);
          getBaristas();
        }
      })
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h4" gutterBottom>Remove Barista</Typography>

      <Autocomplete 
        id="select-user"
        sx={{ width: 300 }}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        isOptionEqualToValue={(option, value) => option.title === value.title}
        getOptionLabel={(option) => option.name}
        options={options}
        loading={loading}
        value={value}
        onChange={(event,newValue) => setValue(newValue)}
        inputValue={inputValue}
        onInputChange={(event,newInputValue) => setInputValue(newInputValue)}

        renderInput={params => 
          <TextField 
            {...params}
            label="User"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        }
      />

      <Button 
        variant="contained" 
        onClick={save}
        sx={{maxWidth: '200px'}}
      >
        Fire Barista
      </Button>
    </Stack> 
  );
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}