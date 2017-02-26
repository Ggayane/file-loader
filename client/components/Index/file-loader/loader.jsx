import React, { Component } from 'react'
import './styles/main.scss'
import { addLoaderListener, removeLoaderListener } from './lib/utils'

export default class FileLoader extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      percentage: 0,
      validFileTypes: ['image/jpeg', 'image/png'],
      fileMaxSize: 1024,
      error: false,
      errorMessage: '',
      uploaded: false,
      uploadStatus: ''
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.file && this.validateFile(nextProps.file)) {
      this.uploadFile(nextProps.file, nextProps.url)
    }
  }

  setUploadedPercentage (e) {
    const percentage = parseInt(100 - (e.loaded / e.total * 100))
    this.setState({percentage})
  }

  uploadFile (file, url) {
    addLoaderListener()
    this.setState({loading: true})
    let uploaded = false
    let uploadStatus = ''
    return $.ajax({
      xhr: function () {
        const xhr = $.ajaxSettings.xhr()
        console.log('aaaaa', xhr.upload)
        if (xhr.upload) {
          xhr.upload.addEventListener('progress', this.setUploadedPercentage, false)
        }
        return xhr
      },
      type: 'POST',
      url: url,
      data: file,
      contentType: false,
      processData: false,
      success: data => {
        uploaded = true
        uploadStatus = data.status === 'ok' ? 'done' : 'failed'
        this.uploadFinished({uploaded, uploadStatus})
      },
      error: () => {
        this.uploadFinished({uploaded: true, uploadStatus: 'error'})
      }
    })
  }

  cancelUpload () {
    this.uploadFile().abort()
    this.uploadFinished({uploaded: true, uploadStatus: 'canceled'})
  }

  uploadFinished (data) {
    this.setState({ uploaded: data.uploaded, uploadStatus: data.uploadStatus })
    removeLoaderListener()
  }

  validateFile (file) {
    const {validFileTypes, fileMaxSize} = this.state
    if (validFileTypes.indexOf(file.type) < 0) {
      this.setState({
        error: true,
        errorMessage: 'Not a valid file type!'
      })
      return false
    }
    if (file.size <= fileMaxSize) {
      this.setState({
        error: true,
        errorMessage: 'File size is too big!'
      })
      return false
    }
    this.setState({
      error: false,
      errorMessage: '',
      uploaded: false,
      loading: false
    })
    return true
  }

  generateStatusClassName () {
    const { loading, uploaded, uploadStatus } = this.state
    if (loading) {
      if (uploaded) {
        switch (uploadStatus) {
          case 'done':
            return ' show finished success'
          case 'failed':
            return ' show finished failed'
          case 'error':
            return ' show finished error'
          case 'canceled':
            return ' show finished canceled'
        }
      }
      return ' show'
    }
    return ''
  }

  showLoader () {
    const {percentage, error} = this.state
    if (error) {
      return this.showErrorMsg()
    }
    const style = {width: percentage + '%'}
    return (
      <div className='file_progress-wrapper'>
        <div className='file_progress' style={style}>
          <span className={'file_progress-status' + (this.generateStatusClassName())}>{this.LoadingProcess()}</span>
        </div>
        {this.props.showCancelBtn ? this.showCancelBtn() : ''}
      </div>
    )
  }

  LoadingProcess () {
    const {percentage, uploaded, uploadStatus} = this.state
    if (uploaded) {
      return uploadStatus
    }
    return percentage + '%'
  }

  showErrorMsg () {
    const {errorMessage} = this.state
    return (
      <div className='error_msg'>
        {errorMessage}
      </div>
    )
  }

  showCancelBtn () {
    return (
      <div className='cancel_btn-wrapper'>
        <button type='button' className='cancel_btn' onClick={() => this.cancelUpload()}>Cancel</button>
      </div>
    )
  }

  render () {
    return this.props.file ? this.showLoader() : null
  }
}

FileLoader.propTypes = {

}
