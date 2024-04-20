import { useEffect } from 'react';
import { db } from './firebase/client';
import { collection, getDocs, where, query } from "firebase/firestore";


export const Redirecter = () => {

      const makeURLOriginal = (safeURL) => {
        return  decodeURIComponent(safeURL).replace(/%2F/g, '/').replace(/%3F/g, '?')
      }

    useEffect(() => {
      const currentUrl = decodeURIComponent(window.location.href)
      const segments = currentUrl.split('/');
      const lastSegment = segments.pop();

      const fetchData = async () => {
       
          try {
              const docSnap = await getDocs(query(collection(db, "links"), where("key", "==", lastSegment)))

              if(docSnap.docs.length == 0){
                  window.location.href = "/notfound"
              }else{
                  window.location.href = makeURLOriginal(docSnap.docs[0].data().link)
              }
          } catch (error) {
              console.error('Error al buscar datos:', error)
          }
      };
      fetchData()
    }, [])

};

