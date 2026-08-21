Rails.application.config.action_mailer.default_options = {
  from: "Candido <no-reply@candidohq.com>"
}

client_origin = ENV.fetch("CORS_ORIGIN", "http://localhost:3000")
uri = URI.parse(client_origin)
Rails.application.config.action_mailer.default_url_options = {
  host: uri.host || "localhost",
  protocol: uri.scheme || "http"
}.tap do |options|
  options[:port] = uri.port if uri.port && ![ 80, 443 ].include?(uri.port)
end

unless Rails.env.test?
  ActionMailer::Base.delivery_method = :smtp
  ActionMailer::Base.smtp_settings = {
    address: "smtp-relay.brevo.com",
    port: 587,
    user_name: ENV["BREVO_SMTP_LOGIN"],
    password: ENV["BREVO_SMTP_KEY"],
    authentication: :login,
    enable_starttls_auto: true
  }
end
