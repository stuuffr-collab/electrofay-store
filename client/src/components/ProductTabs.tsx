interface ProductTabsProps {
  description: string;
  descriptionEn: string;
  category: string;
}

export function ProductTabs({ description, descriptionEn, category }: ProductTabsProps) {
  return (
    <div className="w-full">
      <div className="bg-dark-card rounded-xl p-8 border border-dark-border">
        <h4 className="text-xl font-bold mb-6 text-electric-yellow flex items-center">
          <span className="w-1 h-6 bg-electric-yellow rounded-full ml-3"></span>
          وصف المنتج
        </h4>
        <div className="space-y-6">
          <div className="bg-dark-bg rounded-lg p-6 border border-dark-border/50">
            <p className="text-gray-200 leading-relaxed text-lg font-medium mb-4">
              {description}
            </p>
            {descriptionEn && (
              <div className="border-t border-dark-border/30 pt-4">
                <p className="text-gray-400 text-base italic leading-relaxed">
                  {descriptionEn}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}