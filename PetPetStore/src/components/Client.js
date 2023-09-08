import React from 'react';
import Loading from "./Loading";
import {FirebaseAuth, users, items, ClientClass} from "./firebase_functions"
import {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';
import 'bootstrap/dist/js/bootstrap.min.js';
import {DeleteModal} from "./Client_functions";
import {Button, Card, Col, Container, ListGroup, Navbar, Row} from "react-bootstrap";
import {handleSignOut, Products} from "./Store_functions";
import "./Client.css";
import MaterialTable from 'material-table';
import {BsFillPlusCircleFill} from "react-icons/bs";
import {AiFillMinusCircle} from "react-icons/ai";
import {AiOutlineRollback} from "react-icons/ai";


import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


let needUpdate = true;
let totalPrice = 0;
/**
 * @param {firebase.User} u
 * @param setItemsData
 * @param setClientClass
 * @param {function} updatedPrices
 */
async function loadClient(u, setItemsData, setClientClass, updatedPrices) {
    if (needUpdate) {
        console.log('load client started')
        let client = await users.doc(u.email).get();
        let data = client.data();
        setClientClass(new ClientClass(users.doc(u.email), data));
        let m = {};
        let allItems = await items.get();
        allItems.docs.forEach((item) => {
            if (data.cart[item.id] !== undefined) {
                let t = item.data();
                m[item.id] = new Products(Number(item.id), {
                    name: t.name,
                    imagePath: t.imagePath,
                    quantity: t.quantity,
                    species: t.species,
                    price: t.price,
                    description: t.description
                });
            }
        });
        setItemsData(m);
        needUpdate = false;
        updatedPrices();
    }
}


export function ClientCart(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [itemsData, setItemsData] = useState(null);
    const [client_, setClientClass] = React.useState(null);
    const [deleteModalState, setDeleteModalState] = React.useState(false);
    const [toasterOpen, setToasterOpen] = React.useState(false);
    const [currentItemID, setCurrentItemID] = React.useState(-1);
    const [, setItemsPriceSum] = React.useState(0);
    const [, setNeedUpdate] = React.useState(true);

    useEffect(() => {
        return FirebaseAuth.onAuthStateChanged(async u => {
            await loadClient(u, setItemsData, setClientClass, calculateItemsSum);
            if (!client_) return;
            setIsLoading(false);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client_, props]);


    const getClientCart = () => {
        const columns = [
            {
                title: "Name",
                field: "name",
            },
            {
                title: "species",
                field: "species",
            },
            {
                title: 'Image',
                field: 'img',
                render: item => <img src={item.imagePath} alt="" border="3" height="100" width="100"/>
            },
            {
                title: "Price",
                field: "price",
                type: 'numeric',
                render: item => <h2>${item.price}</h2>
            },
            {
                title: "Quantity",
                field: "quantity",
                type: 'numeric',
                render: item =>
                    <div>
                        <BsFillPlusCircleFill size={19} onClick={() => handleItemIncrease(item.id)}/>
                        <h2>{client_.cart[item.id]}</h2>
                        <AiFillMinusCircle size={19} onClick={() => handleItemDecrease(item.id)}/>
                    </div>
            },
            {
                title: "",
                render: item => <Button variant="danger" onClick={() => {
                    setCurrentItemID(item.id);
                    setDeleteModalState(true)
                }}>Delete</Button>
            }
        ];

        let result = [];
        for (const key in client_.cart) {
            result.push(itemsData[key]);
        }

        return (
            <div>
                <Navbar variant="light" bg="light" expand="lg">
                    <Container fluid>
                        <Row>
                            <Col> <Navbar.Brand>
                                <AiOutlineRollback size={28} onClick={() => {
                                    needUpdate = true;
                                    props.history.push('/store')
                                }}/> Back to
                                store</Navbar.Brand></Col>
                        </Row>
                    </Container>

                </Navbar>
                <MaterialTable title="Your Cart" data={result} columns={columns}
                               options={{
                                   showFirstLastPageButtons: false,
                                   showSelectAllCheckbox: false,
                                   tableLayout: "auto",
                                   showTextRowsSelected: false,
                                   pageSize: [result.length]
                               }}/>
                <Card style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    float: "right", width: '100%'
                }}>
                    <Card.Header>Cart Totals</Card.Header>
                    <ListGroup variant="flush">
                        <ListGroup.Item>Total : {totalPrice}</ListGroup.Item>
                        <ListGroup.Item><Button onClick={() => handleSignOut(props)} >Checkout from the store</Button></ListGroup.Item>
                    </ListGroup>
                </Card>
            </div>
        );
    };

    const handleItemIncrease = async (itemID) => {
        if (toasterOpen)
            return;
        setToasterOpen(true);
        await toast.promise(client_.changeItemQuantity(itemID, client_.cart[itemID] + 1), {
            pending: 'Processing',
            success: 'Item quantity increased',
            error: 'Failed to increase quantity'
        }, {
            onClose: () => setToasterOpen(false)
        });
        calculateItemsSum();
        needUpdate = true;
        setNeedUpdate(true);
    };

    const handleItemDecrease = async (itemID) => {
        if (toasterOpen)
            return;
        setToasterOpen(true);
        await toast.promise(client_.changeItemQuantity(itemID, client_.cart[itemID] - 1), {
            pending: 'Processing',
            success: 'Item quantity decreased',
            error: 'Failed to decrease quantity'
        }, {
            onClose: () => setToasterOpen(false)
        });
        calculateItemsSum();
        needUpdate = true;
        setNeedUpdate(true);
    };

    const handleItemDelete = async (itemID) => {
        if (toasterOpen)
            return;
        setToasterOpen(true);
        await toast.promise(client_.deleteItem(itemID), {
            pending: 'Processing',
            success: 'Item deleted',
            error: 'Failed to delete item'
        }, {
            onClose: () => setToasterOpen(false)
        });
        calculateItemsSum();
        needUpdate = true;
        setNeedUpdate(true);
    };

    const calculateItemsSum = () => {
        let sum = 0;
        if (!client_ || !client_.cart || !itemsData)
            return;
        for (let key in client_.cart) {
            sum += Number(Number(itemsData[key].price).toFixed()) * client_.cart[key];
        }
        console.log('Sum = ' + sum);
        totalPrice = sum;
        setItemsPriceSum(sum);
    }


    if (isLoading) {
        return (
            <div className={'Container'}>
                <Loading/>
            </div>
        );
    }

    return (
        <div style={{display: "flex", paddingTop: '5%'}}>
            <Container fluid={true} className={''}>
                {getClientCart()}
                <DeleteModal
                    show={deleteModalState}
                    onHide={() => {
                        setDeleteModalState(false)
                    }}
                    onDelete={handleItemDelete}
                    currentitemid={currentItemID}
                />
                <ToastContainer
                    position="top-center"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    limit={1}
                    pauseOnFocusLoss={false}
                    pauseOnHover={false}
                    rtl={false}
                    draggable
                />
            </Container>
        </div>
    );
}
