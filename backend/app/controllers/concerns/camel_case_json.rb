module CamelCaseJson
  extend ActiveSupport::Concern

  included do
    before_action :underscore_params!
  end

  def render(*args, **kwargs, &block)
    if kwargs.key?(:json)
      kwargs[:json] = camelize_json(kwargs[:json])
    elsif args.last.is_a?(Hash) && args.last.key?(:json)
      args.last[:json] = camelize_json(args.last[:json])
    end

    super
  end

  private

  def underscore_params!
    params.deep_transform_keys! { |key| key.to_s.underscore }
  end

  def camelize_json(value)
    case value
    when Array
      value.map { |item| camelize_json(item) }
    when Hash
      value.deep_transform_keys { |key| key.to_s.camelize(:lower) }
    else
      serialized = value.respond_to?(:as_json) ? value.as_json : value
      serialized.is_a?(Hash) || serialized.is_a?(Array) ? camelize_json(serialized) : value
    end
  end
end
