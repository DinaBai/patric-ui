import React, {useState, useEffect} from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import CircularProgress from '@material-ui/core/CircularProgress'
import LockIcon from '@material-ui/icons/Lock'

import {queryGenomeNames} from '../../api/data-api'
import InputLabel from '@material-ui/core/InputLabel'


export default function GenomeSelector(props) {
  const {label = 'Select Genome'} = props

  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    (async () => {
      setLoading(true)
      const data = await queryGenomeNames(query)
      setOptions( data.map(obj => ({name: obj.genome_name, ...obj})) )
      setLoading(false)
    })()
  }, [query])


  return (
    <div>
      <InputLabel shrink htmlFor={label}>
        {label}
      </InputLabel>
      <Autocomplete
        id="asynchronous-selector"
        style={{ width: 350 }}
        getOptionLabel={(option) => option.genome_name}
        options={options}
        autoComplete
        includeInputInList
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={(evt) => setQuery(evt.target.value)}
            size="small"
            placeholder="e.g. Mycobacterium tuberculosis H37Rv"
            variant="outlined"
            /*
            InputLabelProps={{
              shrink: true,
            }}
            */
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={16} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={(option) => (
          <div>
            {!option.public && <LockIcon style={{fontSize: 12}} />} {option.name} [{option.genome_id}]
          </div>
        )}
      />
    </div>
  )
}
