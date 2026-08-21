class UserMailer < ApplicationMailer
  layout false

  FEEDBACK_RECIPIENT = "no-reply@candidohq.com".freeze

  def verification_email(user)
    @name = user.name
    @verification_url = user.verification_url
    attach_logo

    mail(to: user.email, subject: "Verify your Candido account")
  end

  def new_feedback_email(feedback_entry)
    @username = feedback_entry.user.name.presence || feedback_entry.user.email
    @category = feedback_entry.type
    @title = feedback_entry.title
    @content = feedback_entry.content
    attach_logo

    mail(to: FEEDBACK_RECIPIENT, subject: "New feedback entry")
  end
end
