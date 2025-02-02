import { Button, ButtonGroup, Card, Modal, Pagination, Table } from 'react-bootstrap';
import './contact-us.scss'
import { useEffect, useState } from 'react';
import { Loading } from '@app/components/loading/Loading';

import ContactusMessage from '@app/types/ContactusMessage';
import { listUserMessages, markMessageAsRead } from '@app/api/ContactusService';
import { formatDateTime } from '@app/utils/DateUtil';



const SIZE = 20;

const Messages = () => {
  const [messages, setMessages] = useState<ContactusMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<ContactusMessage | null>(null);
  const [showDetailsModal, setShowDetailsModel] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);


  const closeAllModals = () => {
    setCurrentMessage(null);
    setShowDetailsModel(false);
  }

  const showDetails = (message: ContactusMessage) => {
    closeAllModals();
    setCurrentMessage(message);
    setShowDetailsModel(true);

    if (!message.read) {
      markMessageAsRead(message.id)
        .then(() => {
          setMessages((prevMessages) =>
            prevMessages.map((m) =>
              m.id === message.id ? { ...m, read: true } : m
            )
          );
        })
    }
  }


  useEffect(() => {
    loadData(currentPage);
  }, []);

  const loadData = (pageNumber: number) => {
    setLoading(true);
    listUserMessages(pageNumber, SIZE).then(page => {
      setMessages(page.content);
      setTotalPages(page.totalPages);
      setTotalElements(page.totalElements);
      setCurrentPage(pageNumber);

    }).finally(() => {
      setLoading(false);

    });
  }


  const pageNumberChange = (pageNumber: number) => {
    loadData(pageNumber);
  }

  return (
    <div>
      {/* @ts-ignore */}
      <Modal show={showDetailsModal && currentMessage} onHide={closeAllModals}>
        {/* @ts-ignore */}
        <Modal.Header closeButton>
          <Modal.Title>{`Full Message`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{currentMessage?.content}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAllModals}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {isLoading ?
        <Loading />
        :
        <Card className="card">
          <Card.Header>
            <h3><i className="fas fa-solid fa-user-md page-icon"></i> Messages</h3>
          </Card.Header>
          <Card.Body>
            <p> <strong>{totalElements}</strong> messages</p>
            <div className="table-responsive">
              <Table className="table-bordered table-striped">
                <thead>
                  <tr>
                    <th className="text-center" scope="col">#</th>
                    <th className="text-center" scope="col">Email</th>
                    <th className="text-center" scope="col">Title</th>
                    <th className="text-center" scope="col">Message</th>
                    <th className="text-center" scope="col">Time</th>
                    <th className="text-center" scope="col">Read ?</th>
                    <th className="text-center" scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>

                  {messages.map((message, idx) => (
                    <tr className='text-center' key={idx}>
                      <th className="text-center" scope="row">{currentPage * SIZE + idx + 1}</th>
                      <td className="text-cener">{message.email}</td>
                      <td className="text-cener">{message.title}</td>
                      <td className="text-center text-ellipsis message-content">
                        {message.content}
                      </td>
                      <td className='text-center'>{formatDateTime(new Date(message.createdAt))}</td>

                      <td className='text-center'>
                        {message.read &&
                          <li className='text-lg fas fa-check-circle text-success'></li>
                        }
                      </td>
                      <td className='text-center'>
                        <ButtonGroup size="sm">
                          <Button type="button" title="view full message" className="action-btn btn btn-info" onClick={() => { showDetails(message) }}>
                            view
                          </Button>

                        </ButtonGroup>
                      </td>
                    </tr>
                  ))
                  }

                </tbody>
              </Table>
            </div>

            <Pagination className='mt-3'>
              {Array(totalPages).fill(0).map((_, number) =>
                <Pagination.Item key={number} active={number === currentPage} onClick={() => pageNumberChange(number)}>
                  {number + 1}
                </Pagination.Item>
              )}
            </Pagination>

          </Card.Body>
        </Card>

      }
    </div>
  )
}

export default Messages;