require 'net/ftp'

class FilesController < ApplicationController
  
  def upload
  end

  def process_file
    file = params[:Filedata]
    filename = params[:Filename]
    Thread.new {
      ftp = start_ftp
      ftp.storbinary("STOR " + filename, StringIO.new(file.read), Net::FTP::DEFAULT_BLOCKSIZE)
      ftp.quit
    }
    render :json => {"filename" => filename}
  end
  
  def check_progress
    ftp = start_ftp
    begin
      size = ftp.size(params[:filename]).to_f
    rescue Exception => e  #presumably the file doesn't exist...
      ftp.quit
      render :json => {"percentage" => 0, "error" => e.message + " " + e.backtrace.inspect} and return
    end
    total = params[:size].to_f
    ftp.quit
    render :json => {"percentage" => (size / total)}
  end
  
  def other_check_progress
    # render :stream => true
  end
  
  private
  
  def start_ftp
    server  = "ftp.example.com"
    user    = "user"
    pass    = "pass"
    ftp = Net::FTP.new(server)
    ftp.login(user, pass)
    ftp.passive = true
    return ftp
  end

end
