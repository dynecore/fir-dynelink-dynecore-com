
import PasswordGenerator from './PasswordGen';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Redirecter } from './redirecter';

function UrlParser() {



  return (
    <BrowserRouter>
      <Routes>
        {/* <Route exact path="/" element={<>welcome</>}/> */}
        {/* <Route exact path="/generate" element={<><PasswordGenerator /></>} /> */}
        <Route exact path="/" element={<><PasswordGenerator /></>} />
        <Route exact path="/notfound" element={<>La url ingresada no existe</>} />
        <Route path="/:content" element={<Redirecter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default UrlParser;

