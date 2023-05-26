import {useEffect, useState} from "react";
import GatewayPage from "../pages/gateway";
import {deleteMethod, getMethod, postMethod} from "../utils/utils";

export default function Gateway() {
  const [gateways, setGateways] = useState([])
  const [gateway, setGateway] = useState({
    'gateway_name': '',
    'ipv4_address': '',
  })
  const [peripheral, setPeripheral] = useState({
    'vendor': '',
    'uid': '',
    'status': ''
  })
  const [showModal, setShowModal] = useState(false)
  const [showPeripheralModal, setShowPeripheralModal] = useState(false)

  useEffect(() => {
    getMethod('gateway').then(r => {
      setGateways(r.data)
    })
  }, [])

  const addNewGateway = async () => {
    await setGateway({
      'gateway_name': '',
      'ipv4_address': '',
    })
    setShowModal(true)
  }

  const addNewPeripheral = async (id) => {
    await setPeripheral({
      'vendor': '',
      'uid': '',
      'status': '',
      'gateway': id
    })
    setShowPeripheralModal(true)
  }

  const editGateway = async (item) => {
    await setGateway({...item})
    setShowModal(true)
  }

  const editPeripheral = async (item) => {
    await setPeripheral({...item})
    setShowPeripheralModal(true)
  }

  const saveGateway = (data, {setErrors, resetForm}) => {
    let url = 'gateway'
    if (data._id) {
      url = 'gateway/' + data._id
    }
    postMethod(url, data).then((result) => {
      if (result.data.errors) {
        let errors = {}
        for (let key in result.data.errors) {
          errors[key] = result.data.errors[key].message
        }
        setErrors(errors)
      } else {
        let tmpGateways = [...gateways]

        let index = tmpGateways.findIndex((i) => i._id === result.data.gateway._id)
        if (index === -1) {
          setGateways([
            ...gateways,
            result.data.gateway
          ])
        } else {
          tmpGateways.splice(index, 1, result.data.gateway)
          setGateways(tmpGateways)
        }

        resetForm()
        setShowModal(false)
      }
    })
  }

  const savePeripheral = (data, {setErrors, resetForm}) => {
    let url = 'peripheral'
    if (data._id) {
      url = 'peripheral/' + data._id
    }
    postMethod(url, data).then((result) => {
      if (result.data.errors) {
        let errors = {}
        for (let key in result.data.errors) {
          errors[key] = result.data.errors[key].message
        }
        setErrors(errors)
      } else if (result.data.error) {
        alert(result.data.message)
      } else {
        let gateway = gateways.find(i => i._id === data.gateway)
        let tmpPeripherals = [...gateway.peripherals]

        let index = tmpPeripherals.findIndex((i) => i._id === result.data.peripheral._id)
        if (index === -1) {
          gateway.peripherals.push(result.data.peripheral)
        } else {
          gateway.peripherals.splice(index, 1, result.data.peripheral)
        }

        index = gateways.indexOf(gateway)
        let tmpGateways = [...gateways]
        tmpGateways.splice(index, 1, gateway)
        setGateways(tmpGateways)

        resetForm()
        setShowPeripheralModal(false)
      }
    })
  }

  const deleteGateway = (id) => {
    if (window.confirm('Are you sure?')) {
      deleteMethod(`gateway/${id}`).then(result => {
        let tmpGateways = [...gateways]
        let index = tmpGateways.findIndex((i) => i._id === id)
        tmpGateways.splice(index, 1)
        setGateways(tmpGateways)
        alert(result.data.message)
      })
    }
  }

  const deletePeripheral = (id, gateway) => {
    if (window.confirm('Are you sure?')) {
      deleteMethod(`peripheral/${id}`).then(result => {
        let tmpGateways = [...gateways]
        let index = gateway.peripherals.findIndex((i) => i._id === id)
        gateway.peripherals.splice(index, 1)
        index = tmpGateways.indexOf(gateway)
        tmpGateways.splice(index, 1, gateway)
        setGateways(tmpGateways)
        alert(result.data.message)
      })
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleCloseModalPeripheral = () => {
    setShowPeripheralModal(false)
  }

  return (
    <GatewayPage
      deletePeripheral={deletePeripheral}
      deleteGateway={deleteGateway}
      editGateway={editGateway}
      editPeripheral={editPeripheral}
      saveGateway={saveGateway}
      savePeripheral={savePeripheral}
      addNewGateway={addNewGateway}
      addNewPeripheral={addNewPeripheral}
      handleCloseModal={handleCloseModal}
      handleCloseModalPeripheral={handleCloseModalPeripheral}
      gateway={gateway}
      peripheral={peripheral}
      showModal={showModal}
      showPeripheralModal={showPeripheralModal}
      gateways={gateways}/>
  )
}