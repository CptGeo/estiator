package com.kalyvianakis.estiator.io.component.patcher;

import com.kalyvianakis.estiator.io.model.Schedule;
import org.springframework.stereotype.Component;

@Component
public class SchedulePatcher implements IPatcher<Schedule> {
    @Override
    public void patch(Schedule existing, Schedule incomplete) {
        if(incomplete.getStartTime() != null) {
            existing.setStartTime(incomplete.getStartTime());
        }
        if(incomplete.getEndTime() != null) {
            existing.setEndTime(incomplete.getEndTime());
        }
    }
}
