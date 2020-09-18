
import React from 'react'
import styled from 'styled-components'
import SignInForm from './SignInForm'
import Step from '@material-ui/core/Step'
import StepIcon from '@material-ui/core/StepIcon'
import StepLabel from '@material-ui/core/StepLabel'
import LockIcon from '@material-ui/icons/LockOutlined'


type Props = {
  title?: string
}

export default function SignIn(props: Props) {
  const {title} = props

  return(
    <Root>
      <Step active={true} completed={false}>
        <StepIcon icon={<div><LockIcon /></div>} />
        <StepLabel>
          {title ? title : 'Please sign in.'}
        </StepLabel>
      </Step>

      <SignInForm />
    </Root>
  )
}

const Root = styled.div`
  max-width: 500px;
  background: #fff;
  margin: 50px auto;
  padding: 20px 20px 10px 20px;
  border: 1px solid #ddd;
`