import React, {useState, forwardRef, useImperativeHandle, useCallback} from 'react'
import {Button, Dialog, DialogActions, DialogTitle} from '@material-ui/core'

const initData = {
  message: '',
  action: () => null
}

const Confrim = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState(initData)

  const handleClose = useCallback(() => setOpen(false), [])

  useImperativeHandle(ref, () => ({
    handleOpen: (data) => {
      setOpen(true)
      setData(data)
    },
    handleClose,
  }))

  return <Dialog
    open={open}
    onClose={handleClose}
    onExited={() => setData(initData)}>
    <DialogTitle>{data.message}</DialogTitle>
    <DialogActions>
      <Button variant='contained' autoFocus onClick={handleClose}>
        Cancel
      </Button>
      <Button variant='contained' color='secondary' onClick={data.action}>
        {data.message?.split(' ')[0]}
      </Button>
    </DialogActions>
  </Dialog>
})

export default Confrim