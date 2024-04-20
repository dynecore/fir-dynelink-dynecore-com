import React, { useState } from 'react';
import { db } from './firebase/client';
import { addDoc, collection, getDocs, where, query  } from 'firebase/firestore';

const PasswordGenerator = () => {
  

    const [link, setLink] = useState('');
    const [message, setMessage] = useState(`
    <div class="flex space-x-2">
    <div class="antitalic">ñ</div>
        <div class="italica">Ñ</div>
        <div class="italica">ñ</div>
       
    </div>`);
    const [url, setURL] = useState('');
    const [isValid, setIsValid] = useState(true);

    const makeURLSafe = (url) => {
        return encodeURI(url).replace(/\//g, '%2F').replace(/\?/g, '%3F')
      };

    async function AddLink (link, key){
        const docSnap = await getDocs(query(collection(db, "links"), where("link", "==", makeURLSafe(link))));

        if(docSnap.docs.length == 0){
            try {
                await addDoc(collection(db, "links"), {
                    key: key,
                    link: makeURLSafe(link)
                });

                const fetchData = async () => {
                    try {
                        const docSnap = await getDocs(query(collection(db, "links"), where("key", "==", key)))
          
                        if(docSnap.docs.length == 0){
                            return({result: "error", dynelink: null})
                        }
                    } catch (error) {
                        console.error('Error al buscar datos:', error)
                    }
                };
                fetchData()


                return({result: "ok", dynelink: "https://fir-dynelink-dynecore-com.web.app/"+ key})
              } 
              catch (e) {
                return({result: "error", dynelink: "servidor caido"})
              }
        }else{
            return({result: "ya en uso", dynelink: "https://fir-dynelink-dynecore-com.web.app/"+docSnap.docs[0].data().key})
        }    
    }

    const makeURLOriginal = (safeURL) => {
        return  decodeURIComponent(safeURL).replace(/%2F/g, '/').replace(/%3F/g, '?')
      }

     const generateLink = async () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let newKey = '';
        for (let i = 0; i < 8; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            newKey += characters.charAt(randomIndex);
        } 
        
        const res = await AddLink(url, newKey)
        if(res.result == "ok" ){
            setLink(res.dynelink)

            setMessage("<span class='text-pink-600' >N</span><span class='text-white'>uevo <span class='text-sky-300'>L</span>ink <span class='text-pink-600'>G</span>enerado</span><span class='text-pink-600'>!</span>")
        }else if( res.result == "ya en uso"){
            setLink(res.dynelink)
            setMessage("<span class='text-pink-600'>L</span><span class='text-white'>ink <span class='text-sky-300'>R</span>ecuperado</span><span class='text-pink-600'>!</span>")
        }else{
            console.log("unknown", res)
        }
    }

      const handleClickCopy = async() => {
        // Copy the text from the input field into the clipboard
        try {
            await navigator.clipboard.writeText(link);
          } catch (e) {
            console.log(e)
          }
      };

    const handleChange = (event) => {
        setURL(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        const valid = urlRegex.test(url);
        setIsValid(valid);
        if(valid){
            generateLink()
        }
    }
    
    return (
        <div className=''>
            <nav className='text-2xl p-3 flex justify-between bg-slate-800 text-white'>
                <div><a href="/">Dynecore</a></div>
                <div><a href="/">About</a></div>
            </nav>

            <header>
                <div className='text-center py-6 text-white'>
                    <h1 className='text-7xl italic font-bold py-6'><span className='text-pink-600'>D</span>yne<span className='text-sky-300'>L</span>ink</h1>
                    <p className='text-3xl font-light py-3 px-1' >Aqui puedes generar un link de cualquier url y tener una version mas corta</p>
                
                </div>
            </header>
          
            <section >
            <form onSubmit={handleSubmit}>
                <div className=' justify-center flex'>
                    <div className='bg-slate-800 md:rounded-3xl border-y-2 md:border-2 border-slate-600 md:w-2/3' >
                        <div className='text-xl text-white text-center py-6 px-1'>Ingresa la URL que quieras reducir y pulsa Generar. si la URL ya está registrada te devolverá su link vinculada</div>
                        
                        <div className='mx-5 md:mx-20'><input type="text" placeholder='https://www.google.com/search?q=cirno&sca_esv=494940dbc25649b8&sca_upv=1&source=hp&ei=aF0hZtLlJ8Sh5OUPoLCjkA4&iflsig=ANes7DEAAAAAZiFreL0jXJbRxZGfBf-s08Q2sykpTmqw&ved=0ahUKEwjSubjcqcyFAxXEELkGHSDYCOIQ4dUDCA0&uact=5&oq=cirno&gs_lp=Egdnd3Mtd2l6IgVjaXJubzIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAuGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgARIggpQ4QVYhwlwAXgAkAEAmAE2oAHMAaoBATW4AQPIAQD4AQGYAgagAtwBqAIKwgIQEAAYAxjlAhjqAhiMAxiPAcICEBAuGAMY5QIY6gIYjAMYjwHCAgsQLhiABBixAxiDAcICERAuGIAEGLEDGNEDGIMBGMcBwgIOEAAYgAQYsQMYgwEYigXCAgsQABiABBixAxiDAcICDhAuGIAEGLEDGNEDGMcBwgIIEAAYgAQYsQPCAggQLhiABBixA8ICBxAuGIAEGArCAgcQABiABBgKmAMFkgcBNqAHxTM&sclient=gws-wiz&arandommessage=like-si-llegaste-hasta-aqui-XD' className=' w-full text-2xl py-3 rounded-full' style={{textIndent: "20px"}}  value={url} onChange={handleChange} /></div>
                        {!isValid && <p className='text-red-500 text-center p-1'>La URL ingresada no es válida.</p>}
                        <div className='flex justify-center py-6'><button type="submit" className=' border-2 border-pink-900 bg-pink-600 text-3xl md:text-lg text-white drop-shadow-sm rounded-full p-1 px-20 '>Generar</button></div>
                    </div>
                </div>
                </form>
            </section>

            <section >
                <div className=' py-6 flex justify-center'><div className=' italic text-white px-12 py-4 rounded-2xl  text-5xl  font-medium ' dangerouslySetInnerHTML={{__html: message}}></div></div>
                
                <div className='flex justify-center'>
                <div className='flex justify-between w-screen mx-5 md:mx-0 md:w-2/3 '>
                    <div className='text-white  text-2xl bg-slate-800 p-3 flex h-16 items-center border-y-2 border-l-2 border-slate-600 rounded-l-full w-full text-nowrap' style={{textIndent: "20px"}}>{link}</div>
                    <button className=' border-2 border-slate-600 bg-slate-700 text-white font-bold capitalize p-3 px-6 rounded-r-full hover:bg-slate-600 ' onClick={handleClickCopy}>copiar</button>
                </div>
                </div>

                <div className='text-3xl text-white italic font-light py-6 w-2/3 m-auto text-center '>Si pierdes tu URL puedes recuperarla volviendola a generar. te responderá con la misma url mientras esté registrada en la base de datos</div>
            </section>


        </div>
    );
};

export default PasswordGenerator;