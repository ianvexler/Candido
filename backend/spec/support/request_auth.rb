module RequestAuth
  def auth_headers(user)
    { "Cookie" => "auth_token=#{create(:session, user: user).token}" }
  end
end

RSpec.configure do |config|
  config.include RequestAuth, type: :request
end
