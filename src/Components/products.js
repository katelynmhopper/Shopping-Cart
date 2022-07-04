import React from "react";
import ReactBootstrap from "react-bootstrap";
import axios from "axios";
import fetchMock from "fetch-mock";
import { mockAPI } from "./mockproducts";


import {
    Card,
    Accordion,
    Button,
    Container,
    Row,
    Col,
    Image,
    Input,
  } from "react-bootstrap";


// simulate getting products from DataBase
const products = [
    { name: "Apples_:", country: "Italy", cost: 3, instock: 10 },
    { name: "Oranges:", country: "Spain", cost: 4, instock: 3 },
    { name: "Beans__:", country: "USA", cost: 2, instock: 5 },
    { name: "Cabbage:", country: "USA", cost: 1, instock: 8 },
  ];
  
  const useDataApi = (initialUrl, initialData) => {
    const { useState, useEffect, useReducer } = React;
    const [url, setUrl] = useState(initialUrl);
  
    const [state, dispatch] = useReducer(dataFetchReducer, {
      isLoading: false,
      isError: false,
      data: initialData,
    });
    console.log(`useDataApi called`);
    useEffect(() => {
      console.log("useEffect Called");
      let didCancel = false;
      const fetchData = async () => {
        dispatch({ type: "FETCH_INIT" });
        try {
          const result = await axios(url);
          console.log("FETCH FROM URL");
          if (!didCancel) {
            dispatch({ type: "FETCH_SUCCESS", payload: result.data });
          }
        } catch (error) {
          if (!didCancel) {
            dispatch({ type: "FETCH_FAILURE" });
          }
        }
      };
      fetchData();
      return () => {
        didCancel = true;
      };
    }, [url]);
    return [state, setUrl];
  };
  
  
  const dataFetchReducer = (state, action) => {
    switch (action.type) {
      case "FETCH_INIT":
        return {
          ...state,
          isLoading: true,
          isError: false,
        };
      case "FETCH_SUCCESS":
        return {
          ...state,
          isLoading: false,
          isError: false,
          data: action.payload,
        };
      case "FETCH_FAILURE":
        return {
          ...state,
          isLoading: false,
          isError: true,
        };
      default:
        throw new Error();
    }
  };
  
  const Products = (props) => {
    const [items, setItems] = React.useState(products);
    const [cart, setCart] = React.useState([]);
    const [total, setTotal] = React.useState(0);

    //  Fetch Data
    const { Fragment, useState, useEffect, useReducer } = React;
    const [query, setQuery] = useState("api/products");
    const [{ data, isLoading, isError }, doFetch] = useDataApi(
      "http://localhost:1337/api/products",
      {
        data: [],
      }
    );
    console.log(`Rendering Products ${JSON.stringify(data)}`);
    console.log("what is data? ", data);
    // Fetch Data
    

  
      
    const addToCart = (e) => {
      let name = e.target.name;
      let item = items.filter((item) => item.name === name);
      if (item[0].instock === 0) return;
      item[0].instock = item[0].instock - 1;
      console.log(`add to Cart ${JSON.stringify(item)}`);
      setCart([...cart, ...item]);
    };
    const deleteCartItem = (delIndex) => {
      // this is the index in the cart not in the Product List
  
      let newCart = cart.filter((item, i) => delIndex !== i);
      let target = cart.filter((item, index) => delIndex === index);
      let newItems = items.map((item, index) => {
        if (item.name === target[0].name) item.instock = item.instock + 1;
        return item;
      });
      setCart(newCart);
      setItems(newItems);
    };
  
    const makeAPIdataUseful = () => {
      console.log("data length: ", data.data.length)
      if (data.data.length > 0) {
        let extractedData = [];
        console.log("data 0 element: ", data.data[0].attributes);
        for (let i=0; i<data.data.length; i++) {
          extractedData.push(data.data[i].attributes);
        };
        console.log(extractedData);
        let apiItems = extractedData.map((item) => {
          let { name, country, cost, instock } = item;
          return { name, country, cost, instock };
        });
          console.log(' what the newItems are:' , apiItems)
          setItems([...items, ...apiItems])
      }
  
    };
  
    let list = items.map((item, index) => {
      let n = index + 1049;
      let picUrl = "https://picsum.photos/id/" + n + "/50/50";
  
      return (
        <li key={index}>
          <Image src={picUrl} width={70} roundedCircle></Image>
          <Button variant="primary" size="large">
          {item.name}:${item.cost}-Stock={item.instock}
          </Button>
          <input name={item.name} type="submit" onClick={addToCart}></input>
        </li>
      );
    });
  
    let cartList = cart.map((item, index) => {
      return (
        <Card key={index}>
          <Card.Header>
            <div>
              {item.name}
            </div>
          </Card.Header>
          <div
            onClick={() => deleteCartItem(index)}
       
          >
            <Card.Body>
              $ {item.cost} from {item.country}
            </Card.Body>
          </div>
        </Card>
      );
    });
  
    let finalList = () => {
      let total = checkOut();
      let final = cart.map((item, index) => {
        return (
          <div key={index} index={index}>
            {item.name}
          </div>
        );
      });
      return { final, total };
    };
  
    const checkOut = () => {
      let costs = cart.map((item) => item.cost);
      const reducer = (accum, current) => accum + current;
      let newTotal = costs.reduce(reducer, 0);
      console.log(`total updated to ${newTotal}`);
      return newTotal;
    };
    // TODO: implement the restockProducts function
    const restockProducts = (url) => {
      doFetch(url);
      makeAPIdataUseful();
      console.log('>>>> Restock')
    };
  
    return (
      <Container>
        <Row>
          <Col>
            <h1>Product List</h1>
            <ul style={{ listStyleType: "none" }}>{list}</ul>
          </Col>
          <Col>
            <h1>Cart Contents</h1>
            <Accordion>{cartList}</Accordion>
          </Col>
          <Col>
            <h1>CheckOut </h1>
            <Button onClick={checkOut}>CheckOut $ {finalList().total}</Button>
            <div> {finalList().total > 0 && finalList().final} </div>
          </Col>
        </Row>
        <Row>
          <form
            onSubmit={(event) => {
              restockProducts(`http://localhost:1337/${query}`);
              console.log(`Restock called on ${query}`);
              event.preventDefault();
            }}
          >
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="submit">ReStock Products</button>
          </form>
        </Row>
      </Container>
    );
  };

  export default Products; 
  