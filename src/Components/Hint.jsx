import * as Dialog from "@radix-ui/react-dialog";
import { FaTimes } from "react-icons/fa";
import PropTypes from "prop-types";

const Hint = ({ hint, setter, open }) => {
  return (
    <Dialog.Root open={open} onOpenChange={setter}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content hint-dialog">
          <Dialog.Close asChild>
            <button type="button" className="dialog-close" aria-label="Close">
              <FaTimes />
            </button>
          </Dialog.Close>
          <Dialog.Description className="dialog-description">
            {hint}
          </Dialog.Description>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

Hint.propTypes = {
  hint: PropTypes.string.isRequired,
  setter: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default Hint;
