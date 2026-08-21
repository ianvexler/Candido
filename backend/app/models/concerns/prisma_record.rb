module PrismaTimestamps
  extend ActiveSupport::Concern

  class_methods do
    private

    def timestamp_attributes_for_create
      [ "createdAt" ]
    end

    def timestamp_attributes_for_update
      [ "updatedAt" ]
    end
  end
end

module PrismaRecord
  extend ActiveSupport::Concern

  class_methods do
    def use_prisma_table(name, timestamps: true)
      self.table_name = name

      if timestamps
        include PrismaTimestamps
      else
        self.record_timestamps = false
      end
    end

    def prisma_aliases(mapping)
      mapping.each { |snake, camel| alias_attribute snake, camel }
    end
  end
end
