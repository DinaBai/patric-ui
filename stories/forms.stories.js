import React from 'react'
import Grid from '@material-ui/core/Grid'

import TextInput from '../src/apps/components/text-input'
import '../src/styles/styles'

export const textInput = () => (
  <Grid container>
    <TextInput label="my label (required!)"/>
  </Grid>
)

