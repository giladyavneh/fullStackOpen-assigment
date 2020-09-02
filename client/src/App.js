import React, { useEffect, useState } from 'react';
import axios from 'axios';



function App() {
  const [book, setBook] = useState([]);
  const [name, setName] = useState();
  const [number, setNumber] = useState();
  const [errMassage,setErrMassage]=useState("")

  const fetch = async () => {
    const { data } = await axios.get('/api/persons')
    console.log("fetching")
    setBook(data);
  }

  useEffect(() => {
    console.log("fetch")
    fetch();
  }, [])

  useEffect(()=>setErrMassage(""),[name,number])

  const handleDelete = (e) => {
    axios.delete(`/api/persons/${e.target.id}`)
    fetch();
  }

  const handleSubmit = async () => {
    try{
      let double=book.find(contact=>contact.name===name)
      let res=double?await axios.put('/api/persons/'+double.id, {
          number
        }):
      await axios.post('/api/persons', {
        name, 
        number
      })
      console.log(res)
    }
    catch(e){
      setErrMassage(e.response.data.error)
    }
    
    
    fetch();
  }

  return (
    <div className="App">
      <h1>Phone Book</h1>
      <ul>
        {book.map(item => 
          <li>{item.name} {item.number} <button id={item.id} onClick={handleDelete}>delete</button></li>
        )}
      </ul>
        <input onChange={(e) => setName(e.target.value)} type='text' placeholder='name'/>
        <input onChange={(e) => setNumber(e.target.value)} type='text' placeholder='number'/>
        <button type="button" onClick={handleSubmit}>Submit</button>
        <div style={{color:"red"}}>{errMassage}</div>
    </div>
  );
}

export default App;

//https://git.heroku.com/salty-wave-47395.git