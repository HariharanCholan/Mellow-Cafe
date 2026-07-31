import React, { useState } from 'react';
    import {
      Dialog,
      DialogContent,
      DialogHeader,
      DialogTitle,
      DialogDescription,
      DialogFooter,
      DialogTrigger,
    } from '@/components/ui/dialog';
    import { Button } from '@/components/ui/button';
    import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
    import { Label } from '@/components/ui/label';
    import { PlusCircle } from 'lucide-react';

    const FlavorDialog = ({ item, onAddToCart, children }) => {
      const [selectedOption, setSelectedOption] = useState(item.options[0]);
      const [isOpen, setIsOpen] = useState(false);

      const handleAddToCart = () => {
        onAddToCart({ ...item, option: selectedOption });
        setIsOpen(false);
      };

      return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>{children}</DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Choose a flavor for {item.name}</DialogTitle>
              <DialogDescription>
                Select one of the delicious options below.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                {item.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <DialogFooter>
              <Button onClick={handleAddToCart} className="bg-red-500 hover:bg-red-600 text-white">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    };

    export default FlavorDialog;