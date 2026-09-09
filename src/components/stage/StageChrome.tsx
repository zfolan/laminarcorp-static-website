export const StageChrome = ({ onRequestAccess }: { onRequestAccess: () => void }) => (
  <div className="stage-chrome">
    <p className="stage-wordmark">
      <img src="/laminar-mark.svg" alt="" width={28} height={28} />
      <span>LAMINAR</span>
    </p>
    <button type="button" className="stage-access-trigger" onClick={onRequestAccess}>
      Request a Demo
    </button>
  </div>
)
