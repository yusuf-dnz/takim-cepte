# Introduction
In this project, we explore the application of deep learning techniques for automating the classification of both textual and video data. Leveraging the power of deep neural networks, we aim to create models that can accurately predict the categories of given text and video inputs.

## Table of Contents
- [Deep Learning Models](#deep-learning-models)
- [Dataset Used](#dataset-used)
- [User Interface Development](#user-interface-development)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Deep Learning Models
For addressing the text classification challenge, we employed two distinct models: Long Short-Term Memory (LSTM) and Bidirectional LSTM. These models have demonstrated their efficacy in capturing the sequential patterns and contextual information present in textual data, thus enhancing our classification capabilities.

In the realm of video classification, we developed two different models: a 3D Convolutional Neural Network (CNN) and a combination of 2D CNN followed by an LSTM layer. The 3D CNN focuses on analyzing spatiotemporal features within video frames, while the 2D CNN + LSTM architecture effectively captures the temporal patterns and dependencies within video sequences.

## Datasets Used
For training our text classification models, we utilized the TC32 dataset. This dataset offers a diverse range of textual data, enabling us to develop models that can effectively categorize text inputs into relevant classes.

When addressing video classification, we worked with a subset of 25 classes from the UCF-101 dataset. This subset was chosen to streamline the training process and ensure efficient model development. The UCF-101 dataset is renowned for its broad collection of action videos, which serve as a suitable foundation for our video classification tasks.

## User Interface Development
To facilitate the utilization of our trained models, we designed a user-friendly interface using PyQt5. This interface enables users to interact with our models seamlessly, making class predictions for various types of input data including audio, video, and text.

Additionally, our interface supports audio and video files for text classification tasks, further enhancing the versatility and usability of our solution. Users can intuitively provide input data through the interface and receive accurate predictions from our deep learning models.
<br />
<br />
<img src=https://github.com/MuhammedGzel/text-and-video-classification/blob/master/images/video_classification_screen.png width="850" height="500">
<br />
<img src=https://github.com/MuhammedGzel/text-and-video-classification/blob/master/images/text_classification_from_text_screen.png width="850" height="500">
<br />
<img src=https://github.com/MuhammedGzel/text-and-video-classification/blob/master/images/text_classification_from_media_screen.png width="850" height="500">

## Requirements
- Python==3.9
- CUDA==11.8
- cuDNN==8.6.0
- keras==2.10.0
- keras_nightly==2.5.0.dev2021032900
- Keras_Preprocessing==1.1.2
- matplotlib==3.7.1
- moviepy==1.0.3
- nltk==3.8.1
- numpy==1.24.2
- opencv_python==4.5.2.52
- opencv_python_headless==4.5.2.52
- pandas==1.5.3
- PyQt5==5.15.9
- PyQt5_sip==12.11.1
- python_vlc==3.0.18122
- scikit_learn==1.2.2
- seaborn==0.12.2
- setuptools==68.1.2
- SpeechRecognition==3.10.0
- tensorflow==2.10.0

## Installation

Follow these steps to set up the project.

1. **Download and install CUDA v11.8:**
   
    Visit the [CUDA Toolkit Archive page](https://developer.nvidia.com/cuda-toolkit-archive) and download CUDA v11.8. Follow the installation instructions provided by NVIDIA 
    to set up CUDA on your system.

2. **Verify CUDA installation:**
   
    Open a terminal and run the following command to verify that CUDA is installed:
    ```
    nvcc --version
    ```
    This should display the version information of CUDA.
   
3. **Download and copy CUDNN v8.6.0:**
   
    Download CUDNN v8.6.0 from [this link](https://developer.nvidia.com/cudnn) and go to the directory where CUDA is installed and copy the files from the archive.

4. **Clone the repository:**
   
    ```
    git clone https://github.com/MuhammedGzel/text-and-video-classification.git
    cd text-and-video-classification
    ```

5. **Install project dependencies:**
   
    ```
    pip install -r requirements.txt
    ```

6. **Download our trained models:**
    
    Download trained models from [this link](https://drive.google.com/drive/folders/18BHBPTxCNlpPwCdpjxTVlM6yjbFaSGuw?usp=sharing)
    
   After the download is complete; copy the networks folder from the text_classification folder into the text_classification folder in the project root directory and copy the networks folder from the video_classification folder into the video_classification folder in the project root directory.

## Usage
**Start the application:**

    
    python main.py
    
