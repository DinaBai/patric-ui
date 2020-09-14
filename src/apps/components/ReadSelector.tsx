/* eslint-disable react/display-name */
/**
 * Read Selector
 *
 * Todo:
 *  - provide onAdd/onRemove methods?
 */

import React, {useState, useEffect, useRef} from 'react'
import styled from 'styled-components'

import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import AddIcon from '@material-ui/icons/PlayCircleOutlineRounded'
import HelpIcon from '@material-ui/icons/HelpOutlineRounded'
import ArrowIcon from '../../../assets/icons/arrow-circle-o-right.svg'

import ObjectSelector from './object-selector/ObjectSelector'
import SelectedTable from './SelectedTable'
import TextInput from './TextInput'
import AdvandedButton from './AdvancedButton'
import Selector from './Selector'


import { parsePath } from '../../utils/paths'

import {validateSRR} from '../../api/ncbi-eutils'
import { Divider } from '@material-ui/core'


const AddBtn = ({onAdd, disabled = false, ...rest}) =>
  <Tooltip
    title={<>{disabled ? 'First, select some read files' : 'Add item to selected libraries'}</>}
    placement="top"
  >
    <span>
      <AddItemBtn
        aria-label="add item"
        onClick={onAdd}
        disabled={disabled}
        color="primary"
        endIcon={<AddIcon />}
        disableRipple
        {...rest}
      >
        Add
      </AddItemBtn>
    </span>
  </Tooltip>


const AddItemBtn = styled(Button)`

`

const columns = [{
  id: 'label',
  label: () =>
    <div>
      Selected Libraries
      <Tooltip
        title="Read libraries placed here will contribute to a single assembly"
        placement="top"
      >
        <HelpIcon color="primary" className="hover" style={{fontSize: '1.2em'}}/>
      </Tooltip>
    </div>,
  format: (_, row) => <span>{row.reads}</span>
}, {
  type: 'infoButton'
}, {
  type: 'removeButton'
}]

// todo(nc): define reads

type Props = {
  onChange: (object) => void
  advancedOptions?: boolean
  reads?: object[]
}


export default function ReadSelector(props: Props) {
  const { onChange, advancedOptions} = props

  const didMountdRef = useRef()

  // currently selected path (for single reads)
  const [path, setPath] = useState(null)

  // currently selected paths (for single paired reads)
  const [path1, setPath1] = useState(null)
  const [path2, setPath2] = useState(null)

  // current SRA ID input
  const [sraID, setSraID] = useState(null)

  // list of selected reads
  const [reads, setReads] = useState(props.reads)

  const [advOpen, setAdvOpen] = useState(false)

  const [interleaved, setInterleaved] = useState('false')
  const [read_orientation_outward, setMatePaired] = useState('false')
  const [platform, setPlatform] = useState('infer')

  const [sraMsg, setSRAMsg] = useState(null)
  const [sraError, setSRAError] = useState(null)


  useEffect(() => {
    /*if (!didMountdRef.current) {
      didMountdRef.current = true]
      return
    }*/

    setReads(props.reads)
  }, [props.reads])

  // two way binding on "reads"
  useEffect(() => {
    onChange(reads)
  }, [reads])


  function onAdd(type) {
    let row
    if (type == 'single') {
      row = {
        type: 'single_end_libs',
        label: parsePath(path).name,
        value: {
          read: path,
          platform,
          interleaved,
          read_orientation_outward
        }
      }
    } else if (type == 'paired') {
      row = {
        type: 'paired_end_libs',
        label: parsePath(path1).name+ ', ' + parsePath(path2).name,
        value: {
          read1: path1,
          read2: path2,
          platform,
          interleaved,
          read_orientation_outward
        }
      }
    }

    // add reads
    setReads(prev => ([...prev, row]))
  }

  const onAddSRA = (id) => {
    if (id != '')
      validateSra(id)
  }

  const onRemoveAll = () => {
    setReads([])
  }

  const onRemove = ({index}) => {
    setReads(prev => prev.filter((_, i) => i != index))
  }

  const validateSra = (id) => {
    console.log('validating', id)

    try {
      const blah = validateSRR(id).catch(() => {
        alert('not valid')
      })
      console.log('blah', blah)
    } catch (e) {
      console.log(e)
      setSRAError(e)
    }
  }


  return (
    <Root>
      <Inputs>

        <Row>
          <Column>
            <Title>
              Paired Read Library
            </Title>
            <Row>
              <ObjectSelector
                label=" "
                value={path1}
                onChange={val => setPath1(val)}
                type="reads"
                dialogTitle="Select read file"
                placeholder="Read file 1"
              />
            </Row>
            <Row>
              <ObjectSelector
                label=" "
                value={path2}
                onChange={val => setPath2(val)}
                type="reads"
                dialogTitle="Select read file 2"
                placeholder="Read file 2"
              />
            </Row>

          </Column>

          {path1 && path2 &&
            <div className="align-self-center" >
              <AddBtn onAdd={() => onAdd('paired')}/>
            </div>
          }
        </Row>

        <Row>
          <Column>
            <Title>
              Single Read Library
            </Title>
            <Row>
              <ObjectSelector
                label=" "
                value={path}
                onChange={val => setPath(val)}
                type="reads"
                dialogTitle="Select (single) read file"
                placeholder="Read file"
              />

              {path &&
                <div className="align-self-center" >
                  <AddBtn onAdd={() => onAdd('single')} />
                </div>
              }
            </Row>
          </Column>
        </Row>

        <Row>
          <Column>
            <Title>
              SRA run accession
            </Title>

            <Row>
              <TextInput
                placeholder="SRR"
                value={sraID}
                onChange={val => setSraID(val)}
                noLabel
                error={!!sraError}
                helperText={sraMsg || sraError}
              />

              {sraID &&
                <div className="align-self-center">
                  <AddBtn onAdd={() => onAddSRA('sra')} />
                </div>
              }
            </Row>

          </Column>
        </Row>

      </Inputs>

      <TableContainer>
        <SelectedTable
          columns={columns}
          rows={reads}
          onRemove={onRemove}
          emptyNotice={<i>Place read files here using the fields to the left</i>}
        />
      </TableContainer>

    </Root>
  )
}

const Root = styled.div`
  display: flex;
  flex: 1;
`

const Inputs = styled.div`
  flex-direction: column;
  justify-content: flex-start;
  flex: 1;
`

const Title = styled.div`
  margin: 0 0 0px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: rgba(0, 0, 0, 0.87);
  font-weight: 500;
  font-size: .85em;
`

const TableContainer = styled.div`
  flex: 1;
  margin: 0 5px;
`

const Row = styled.div`
  display: flex;
  align-items: flex-end;
  margin-bottom: 3px;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
`