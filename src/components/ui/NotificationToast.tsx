import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

export function NotificationToast({
  open,
  message = 'Vous avez un message',
}: {
  open: boolean
  message?: string
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16 }}
          className="glass fixed right-4 bottom-4 z-[80] flex items-center gap-3 rounded-2xl px-4 py-3 neon-border"
          role="status"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-electric/20 text-cyan">
            <MessageCircle size={18} />
          </span>
          <div>
            <p className="font-display text-xs tracking-wider text-cyan uppercase">Notification</p>
            <p className="text-sm text-snow">{message}</p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
