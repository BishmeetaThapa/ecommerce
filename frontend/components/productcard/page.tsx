import React from 'react'

import { useDarkMode } from '../DarkModeProvider/page';

import axios from 'axios';
import ItemCard from '../card/page';

const ProductCard =async () => {
  
 const {data} = await axios.get('http://makeup-api.herokuapp.com/api/v1/products.json ')

  return (
   
 <div className='flex flex-wrap'>
       {
        data.map((item,id)=>(
            <ItemCard key={id} product={item}/>
        ))}
      
          
        </div>
  )
}

export default ProductCard