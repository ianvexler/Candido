class ApiError < StandardError
  attr_reader :status

  def initialize(message, status: :unprocessable_content)
    super(message)
    @status = status
  end
end
