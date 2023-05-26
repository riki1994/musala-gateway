import {Fragment} from 'react';
import {Button, Form, Modal, Row, Table} from "react-bootstrap";
import {Formik} from "formik";
import Moment from "moment";
import * as yup from "yup";

export default function GatewayPage(props) {
  const schema = yup.object().shape({
    gateway_name: yup.string().required(),
    ipv4_address: yup.string().required()
  });

  const schemaPeripheral = yup.object().shape({
    vendor: yup.string().required(),
    uid: yup.number().required(),
    status: yup.string().required(),
  });

  return (
    <>
      <Button variant="primary" onClick={props.addNewGateway}>
        Add New Gateway
      </Button>

      <Formik
        onSubmit={props.saveGateway}
        validationSchema={schema}
        initialValues={props.gateway}
        enableReinitialize={true}
      >
        {({
            handleSubmit,
            handleChange,
            values,
            errors,
          }) => (
          <Form noValidate onSubmit={handleSubmit} id="saveGateway">
            <Modal show={props.showModal} onHide={props.handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Gateway</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row>
                  <Form.Group>
                    <Form.Label>Gateway Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="gateway_name"
                      value={values.gateway_name}
                      onChange={handleChange}
                      isInvalid={!!errors.gateway_name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.gateway_name}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>IPV4 Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="ipv4_address"
                      value={values.ipv4_address}
                      onChange={handleChange}
                      isInvalid={!!errors.ipv4_address}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.ipv4_address}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={props.handleCloseModal}>
                  Close
                </Button>
                <Button type="submit" form="saveGateway" variant="primary">
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </Form>
        )}
      </Formik>

      <Formik
        onSubmit={props.savePeripheral}
        validationSchema={schemaPeripheral}
        initialValues={props.peripheral}
        enableReinitialize={true}
      >
        {({
            handleSubmit,
            handleChange,
            values,
            errors,
          }) => (
          <Form noValidate onSubmit={handleSubmit} id="savePeripheral">
            <Modal show={props.showPeripheralModal}
                   onHide={props.handleCloseModalPeripheral}>
              <Modal.Header closeButton>
                <Modal.Title>Peripheral</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row>
                  <Form.Group>
                    <Form.Label>Vendor</Form.Label>
                    <Form.Control
                      type="text"
                      name="vendor"
                      value={values.vendor}
                      onChange={handleChange}
                      isInvalid={!!errors.vendor}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.vendor}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>UID</Form.Label>
                    <Form.Control
                      type="number"
                      name="uid"
                      value={values.uid}
                      onChange={handleChange}
                      isInvalid={!!errors.uid}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.uid}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      isInvalid={!!errors.status}>
                      <option>--</option>
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.status}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={props.handleCloseModalPeripheral}>
                  Close
                </Button>
                <Button type="submit" form="savePeripheral" variant="primary">
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </Form>
        )}
      </Formik>

      <Table striped bordered hover>
        <thead>
        <tr>
          <th>Serial ID</th>
          <th>Gateway Name</th>
          <th>IP V4</th>
          <th>Total of peripherals</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {props.gateways.map(item => (
            <Fragment key={item._id}>
              <tr>
                <td>{item.id}</td>
                <td>{item.gateway_name}</td>
                <td>{item.ipv4_address}</td>
                <td>{item.peripherals.length}</td>
                <td>
                  <a href="#" onClick={() => props.addNewPeripheral(item._id)}>Add
                    Peripheral</a>{' '}
                  <a href="#"
                     onClick={() => props.editGateway(item)}>Edit</a>{' '}
                  <a href="#"
                     onClick={() => props.deleteGateway(item._id)}>Delete</a>
                </td>
              </tr>
              {item.peripherals.length === 0 ? null : (
                <tr>
                  <td colSpan={5} style={{margin: '5px'}}>
                    <Table striped bordered hover key={item._id + 'table'}>
                      <thead>
                      <tr>
                        <th>UID</th>
                        <th>Vendor</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Actions</th>
                      </tr>
                      </thead>
                      <tbody>
                      {item.peripherals.map(p => (
                        <tr key={p._id}>
                          <td>{p.uid}</td>
                          <td>{p.vendor}</td>
                          <td>{p.status}</td>
                          <td>{Moment(p.created_at).format('MM/DD/YYYY H:mm:ss')}</td>
                          <td>
                            <a href="#"
                               onClick={() => props.editPeripheral(p)}>Edit</a>{' '}
                            <a href="#"
                               onClick={() => props.deletePeripheral(p._id, item)}>Delete</a>
                          </td>
                        </tr>
                      ))}
                      </tbody>
                    </Table>
                  </td>
                </tr>
              )}
            </Fragment>
          )
        )}
        </tbody>
      </Table>
    </>
  )
}