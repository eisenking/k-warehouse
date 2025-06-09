import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default  function TasksControls() {
  return (
    <div>
        <div className="flex items-center mb-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Добавить
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Добавить продукт</DialogTitle>
                  <DialogDescription>Укажите данные нового продукта</DialogDescription>
                </DialogHeader>


                
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex items-center mb-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Добавить ТехКарту
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Добавить продукт</DialogTitle>
                  <DialogDescription>Укажите данные нового продукта</DialogDescription>
                </DialogHeader>

                
              </DialogContent>
            </Dialog>
          </div>
    </div>
  )
}