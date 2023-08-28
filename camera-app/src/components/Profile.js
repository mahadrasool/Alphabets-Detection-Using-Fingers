import React, { Component, useRef } from 'react';
import Webcam from 'react-webcam';

class WebcamCapture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      intervalId: null,
      images: [],
      message: '',
      receivedAlphabets: '', // New state for received alphabets
      
      };
    this.webcamRef = React.createRef();
  }

  componentDidMount() {
    console.log('Test word')
    const intervalId = setInterval(() => {
      this.captureImage();
    }, 8000);
    this.setState({ intervalId });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  captureImage = async () => {
    //const webcamRef = useRef(null).current
    //this.showMessage('sample')
    //if (webcamRef) {
      this.clearAllImages()
      const imageSrc = this.webcamRef.current.getScreenshot();
      
      /*
      this.setState((prevState) => ({
        images: [...prevState.images, imageSrc],
      }));
      */

      try {
        //this.showMessage('sample-2')      
        const alphabet = await this.sendImageToApi(imageSrc);
        this.setState((prevState) => ({
          receivedAlphabets: [...prevState.receivedAlphabets, alphabet],
        }));
        //this.showMessage(JSON.stringify(alphabet))
        //this.showMessage(`Received alphabet: ${alphabet}`);
      } catch (error) {
        //this.showMessage('sample-3') 
        console.error('Error sending image to API:', error);
      }
    //}
  };

  sendImageToApi = async (image) => {
    const apiUrl = 'http://127.0.0.1:8000/receive-image/';
 
    try {
      const formData = new FormData();
      formData.append('image', image);
     
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });
      //this.showMessage('Working here') 
  
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log('Received response data:', responseData);
      
      if (responseData && responseData.alphabet) {
        console.log('Received alphabet:', responseData.alphabet);
        return responseData.alphabet;
      } else {
        console.log('No data received');
        throw new Error('Invalid response format');
      }
      
    } catch (error) {
      //this.showMessage(error)
      console.error('Error sending image to API:', error);
      throw error; // Rethrow the error to handle it at a higher level if needed
    }
  };
  
  clearAllImages = () => {
    this.setState({ images: [] });
    //this.showMessage('All images cleared.');
  };

  showMessage = (message) => {
    this.setState((prevState) => ({
      receivedAlphabets: prevState.receivedAlphabets + '' + message // Append to existing messages
    }));
  };
  saveToFile = () => {
    const { receivedAlphabets } = this.state;
    const blob = new Blob([receivedAlphabets], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'receivedAlphabets.txt';
    link.click();
  };

  render() {
   
    return (
      <div>
        <header style={headerStyle}>
          <h1 style={headingStyle}>Camera App</h1>
        </header>
      
      <div style={contentStyle} >
        <h1>Webcam Capture</h1>
        <Webcam
          ref={this.webcamRef}
          screenshotFormat="image/jpeg"
        />
      <div>
          <textarea
          style={{
            width: '50%',      // Adjust the width as needed
            height: '150px',   // Adjust the height as needed
            padding: '10px',   // Adjust padding as needed
            fontSize: '16px',  // Adjust font size as needed
            border: '1px solid #ccc',
            borderRadius: '5px',
            resize: 'vertical', // Allow vertical resizing
          }}
            rows="4"
            cols="50"
            value={this.state.receivedAlphabets} // Display received alphabets in the textbox
           
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <button className='btn btn-primary' style={{ margin: 3 }} onClick={this.clearAllImages}>Clear all</button> 
          <button className='btn btn-primary' style={{ margin: 3 }} onClick={this.saveToFile }>Save to file</button>
          <button className='btn btn-danger' style={{ margin: 3 }} onClick={() => window.close()}>Quit</button>
        </div>
      </div>
      <footer style={footerStyle}>
          <p>&copy; 2023 Your Camera App. All rights reserved.</p>
        </footer>
      </div>
    );
    
  }
  
}

const headerStyle = {
  background: '#007bff',
  color: '#fff',
  padding: '1rem',
  textAlign: 'center',
};

const headingStyle = {
  margin: 0,
};

const contentStyle = {
  padding: '2rem',
};
const footerStyle = {
  background: '#f8f9fa',
  padding: '1rem',
  textAlign: 'center',
  position: 'flex-end',
  bottom: 0,
  width: '100%',
};
export default WebcamCapture;
