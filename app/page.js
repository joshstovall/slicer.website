"use client";

import React, { useState } from 'react';

import styles from './page.module.css'
import Scene from './scene'

export default function Home() {

  const [url, setUrl] = useState('');

  return (
    <main className={styles.main}>

      <div className={styles.canvas}>
        <Scene stl={url} />
      </div>

      <div className={styles.description}>

        <input type="file"
          onChange={(event) => {
            if (event.target.files && event.target.files[0]) {
              let stl_url = URL.createObjectURL(event.target.files[0]);
              setUrl(stl_url);
            }
          }}
        />
        
        <p>👈  Upload a STL</p>

        <div>Slicer <br />Website</div>

      </div>

    </main>
  )

}
