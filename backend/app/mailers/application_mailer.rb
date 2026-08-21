class ApplicationMailer < ActionMailer::Base
  default from: "Candido <no-reply@candidohq.com>"
  layout "mailer"

  private

  def attach_logo
    path = Rails.root.join("app/assets/images/logo.png")
    return unless path.exist?

    attachments.inline["logo.png"] = File.binread(path)
  end
end
