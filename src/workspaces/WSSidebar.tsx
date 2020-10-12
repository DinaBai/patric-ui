import React, { useEffect } from 'react'
import {Link, useParams} from 'react-router-dom'
import styled from 'styled-components'

import InfoIcon from '@material-ui/icons/InfoOutlined'
import HelpIcon from '@material-ui/icons/HelpOutlineRounded'
import CaretIcon from '@material-ui/icons/ExpandMoreRounded'
import FolderIcon  from '@material-ui/icons/FolderOutlined'
import MyIcon from '@material-ui/icons/AccountCircleRounded'
import SharedIcon from '@material-ui/icons/PeopleAltRounded'
import PublicIcon from '@material-ui/icons/PublicRounded'
import SpecialFolderIcon from '@material-ui/icons/FolderSpecialRounded'

import {getUser} from '../api/auth'

import { WSObject } from '../api/ws-api'


// only for testing
import config from '../config'

const menu = [
  {
    path: `${getUser(true)}`, label: 'My Workspaces',
    icon: <MyIcon />, caret: true
  }, {
    path: `${getUser(true)}/home`, label: 'Home',
    indent: 2, icon: <FolderIcon />, caret: true
  }, {
    path: `${getUser(true)}/home/Genome Groups`, label: 'Genome Groups',
    indent: 3, icon: <SpecialFolderIcon />
  },{
    path: `${getUser(true)}/home/Feature Groups`, label: 'Feature Groups',
    indent: 3, icon: <SpecialFolderIcon />
  }, {
    path: `${getUser(true)}/home/Experiment Groups`, label: 'Experiment Groups',
    indent: 3, icon: <SpecialFolderIcon />
  }, {
    label: 'Shared with me',
    icon: <SharedIcon />
  }, {
    label: 'Public Workspaces',
    icon: <PublicIcon />
  }
]


type Props = {
  isObjectSelector?: boolean
  selected?: WSObject[]
}

const WSSideBar = (props: Props) => {
  const {path} = useParams()

  const {isObjectSelector} = props


  const onNav = (evt) => {
    if (isObjectSelector) {
      evt.preventDefault()
    }
  }

  return (
    <SidebarRoot>
      {!isObjectSelector &&
        <Title>
          Workspaces
          <sup>
            <P3Link
              href={`${config.p3URL}/workspace/${path}`}
              target="_blank"
            >
              <HelpIcon />
            </P3Link>
          </sup>
        </Title>
      }

      <Menu>
        {menu.map((item) => {
          if (item.label == 'Shared with me')
            return <></>

          return (
            <li key={item.label}>
              <MenuItem
                indent={item.indent}
                caret={item.caret ? 1 : 0}
                className={item.path == path ? 'active no-style' : 'no-style hover'}
                to={`/files/${item.path}`}
                onClick={onNav}
              >
                {item.caret &&
                  <Caret><CaretIcon color={item.path == path ? 'primary' : 'inherit'} /></Caret>
                }
                {item.icon &&
                  <Icon>{React.cloneElement(item.icon, {color: item.path == path ? 'primary' : 'inherit'})}</Icon>
                }
                {item.label}
              </MenuItem>
            </li>
          )
        })}
      </Menu>
    </SidebarRoot>
  )
}

const sidebarWidth = '210px'

const SidebarRoot = styled.div`
  width: ${sidebarWidth};
  padding: 5px 0 10px 0px;
  border-right: 1px solid #ccc;

  .MuiTab-wrapper {
    display: inline-block;
  }
`

const Title = styled.div`
  font-size: 1.2em;
  margin: 10px;
`

const Menu = styled.ul`
  position: relative;
  padding: 0;
  font-size: 1em;
  list-style: none;
`
const indention = 8

const MenuItem = styled(Link)`
  display: flex;
  padding: 5px 0 5px 5px;
  display: flex;
  align-items: center;

  &.active {
    border-right: 3px solid #2e75a3;
    background-color: #f2f2f2;
    font-weight: 900;
  }

  ${props => props.indent &&
    `padding-left: ${props.indent * indention + (!props.caret ? 21 : 0)};`}

  ${props => props.indent &&
    `font-size: .9em`}
`

const Icon = styled.div`
  margin-right: 5px;
`

const Caret = styled.div`
  width: 20px;
  svg {
    width: 20px;
  }
`


const P3Link = styled.a`
  svg { font-size: 1.25em; }
`


export {sidebarWidth}

export default WSSideBar