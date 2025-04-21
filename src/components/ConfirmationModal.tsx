import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel"
}: ConfirmationModalProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md p-6 shadow-2xl transition-all border border-orange-100">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 bg-rose-100 rounded-full p-2">
                    <ExclamationTriangleIcon className="h-6 w-6 text-rose-600" />
                  </div>
                  <div className="flex-1">
                    <Dialog.Title className="text-xl font-['Playfair_Display'] font-semibold text-rose-700 mb-2">
                      {title}
                    </Dialog.Title>
                    <p className="text-sm font-['DM_Sans'] text-orange-800 mb-6">
                      {message}
                    </p>
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        className="px-4 py-2 text-sm font-['DM_Sans'] font-medium text-orange-700 hover:bg-orange-50 rounded-xl transition-colors"
                        onClick={onClose}
                      >
                        {cancelText}
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 text-sm font-['DM_Sans'] font-medium text-white bg-gradient-to-r from-rose-500 to-rose-600 rounded-xl hover:shadow-lg hover:shadow-rose-200/50 transform hover:-translate-y-0.5 transition-all duration-200"
                        onClick={() => {
                          onConfirm();
                          onClose();
                        }}
                      >
                        {confirmText}
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConfirmationModal; 