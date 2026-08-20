import RemoteSlot from './RemoteSlot';
import { MisDashboard } from '../remotes/misRemote';

// The whole page is owned by the MIS team; the host only supplies the frame.
export default function MisPage() {
  return (
    <section className="ap-page">
      <RemoteSlot name="MIS dashboard">
        <MisDashboard title="MIS Overview — regional performance" />
      </RemoteSlot>
    </section>
  );
}
