class UsersController < ApplicationController
  respond_to :html, :json
  skip_before_filter :require_login, only: [:new, :create, :signup_email, :dynamic_home]

  def new
    @user = User.new
  end

  def create
    @user = User.new(params[:user])
    @user.time_zone = cookies["jstz_time_zone"]

    if @user.save
      user = login(params[:user][:email], params[:user][:password], true)

      respond_to do |format|
        format.html { redirect_to clients_path, notice: welcome_message }
        format.json { render status: 201 }
      end
    else
      respond_to do |format|
        format.html { render :new }
        format.json { render status: 400, json: { :errors => @user.errors.full_messages } }
      end
    end
  end

  def show
    respond_to do |format|
      format.html {}
      format.json { render json: current_user }
    end

  end

  def signup_email
    @user = User.new
    @user.time_zone = cookies["jstz_time_zone"]

    if params[:singup_email] == nil
      @user.email = User.unused_random_email
    else
      @user.email = params[:signup_email]
    end

    temp_pw = SecureRandom.hex
    @user.set_temp_password temp_pw
    unless @user.save
      flash[:alert] = "Sorry, that email has already been taken/is invalid. Please try again."
      render "new"
      return
    end

    if @user.demo?
      user = login(@user.email, temp_pw, true)
      redirect_to clients_path, notice: welcome_message
    else
      begin
        UserMailer.temp_password_email(temp_pw, @user).deliver
      ensure
        user = login(@user.email, temp_pw, true)
        redirect_to clients_path, notice: welcome_message
      end
    end
  end

  def dynamic_home
    flash.keep
    if current_user
      redirect_to clients_path
    else
      redirect_to root_url
    end
  end

  def edit
    @user = current_user
  end

  def update
    @user = current_user
    if @user.update_attributes(params[:user])
      redirect_to dynamic_home_path, notice: 'Successfuly updated user details.'
    else
      render action: "edit"
    end
  end

  def welcome_message
    "Thank you for testing Zeitkit.<script>_gaq.push(['_trackPageview', '/register_success']);</script>".html_safe
  end

  def github_commit_messages
    if current_user.github_client
      respond_with current_user.github_client.get_commits_between(start_date: params[:start_date], end_date: params[:end_date])
    else
      respond_with []
    end
  end

  def usernames
    result = []
    if params[:query].present?
      result = User.select("username, id").
        where("username ILIKE ? AND username != ?", "%#{params[:query]}%", current_user.username).
        limit(10).map(&:username)
    end
    render json: result.to_json, status: 200
  end

  def clients
    render json: current_user.clients.to_json, status: 200
  end

  def shared_clients
    render json: current_user.shared_clients.to_json, status: 200
  end

end
